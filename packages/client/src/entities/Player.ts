import * as THREE from 'three';
import App from '../app';
import PlayerManager from '../managers/PlayerManager';
import StateBuffer from '../managers/StateBuffer';
import { PlayerState } from './../../../server/src/rooms/schema/MyRoomState';
import Spaceship from './Spaceship';
import {
	getForwardMovement,
	updateRotation,
} from '../../../../shared/physics/movement';

export default class Player {
	public spaceShip: Spaceship;
	public state: PlayerState;
	public buffer: StateBuffer;

	public direction: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

	public latestServerState: { state: PlayerState; wasConsumed: boolean } = {
		state: null,
		wasConsumed: null,
	};

	constructor(
		readonly app: App,
		serverState: PlayerState,
		readonly playerManager: PlayerManager,
		readonly isSelf = false
	) {
		this.buffer = new StateBuffer(this);
		this.spaceShip = new Spaceship(app.currentScene, this);

		// set spawn
		this.spaceShip.position.set(serverState.x, serverState.y, serverState.z);
		this.spaceShip.setColor(serverState.color);
		this.latestServerState.wasConsumed = false;
		this.latestServerState.state = serverState;

		// set initial buffer record for spawn
		this.buffer.add(serverState);
	}

	public update(deltaMs: number) {
		// update own direction from keys, enemy from server
		this.updateDirection();

		// apply rotation based on input

		updateRotation(deltaMs, this.direction, this.spaceShip.rotation);

		// predict position and change this.position
		// getForwardMovement(
		// 	deltaMs,
		// 	this.spaceShip.rotation,
		// 	this.spaceShip.position
		// );

		const currentState = this.getCurrentState();
		this.buffer.add(currentState);

		// reconcile position from server update
		if (this.latestServerState.wasConsumed === false) {
			this.buffer.reconcile(this.latestServerState.state);
			this.latestServerState.wasConsumed = true;
		}

		// position only to be set from latest(current) buffer entry
		this.spaceShip.updateFromBuffer();

		this.app.client.sendServerUpdate();
	}

	private updateDirection() {
		if (this.isSelf) {
			this.direction.set(0, 0, 0);
			if (this.app.controls.keysPressed['w']) this.direction.setX(1);

			if (this.app.controls.keysPressed['s']) this.direction.setX(-1);

			if (this.app.controls.keysPressed['a']) this.direction.setY(-1);

			if (this.app.controls.keysPressed['d']) this.direction.setY(1);

			// this.direction.normalize();
		}

		if (!this.isSelf) {
			this.direction.set(
				this.latestServerState.state.dx,
				this.latestServerState.state.dy,
				0
			);
		}
	}

	public getCurrentState(): PlayerState {
		const state = new PlayerState();
		state.timestamp = Date.now();

		state.dx = this.direction.x;
		state.dy = this.direction.y;

		state.x = this.spaceShip.position.x;
		state.y = this.spaceShip.position.y;
		state.z = this.spaceShip.position.z;

		state.u = this.spaceShip.rotation.x;
		state.v = this.spaceShip.rotation.y;
		state.w = this.spaceShip.rotation.z;

		return state;
	}
}
