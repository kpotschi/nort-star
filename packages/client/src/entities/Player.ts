import * as THREE from 'three';
import App from '../app';
import PlayerManager from '../managers/PlayerManager';
import StateBuffer from '../managers/StateBuffer';
import { PlayerState } from './../../../server/src/rooms/schema/MyRoomState';
import Spaceship from './Spaceship';
import { updateRotation } from '../../../../shared/config/physics/movement';

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
		this.buffer = new StateBuffer(this, serverState);

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

		updateRotation(
			deltaMs,
			this.direction.x,
			this.direction.z,
			this.spaceShip.quaternion
		);

		// predict position and change this.position
		this.spaceShip.updatePosition(deltaMs);

		const currentState = this.getCurrentState();
		this.buffer.add(currentState);

		// reconcile position from server update
		if (this.latestServerState.wasConsumed === false) {
			this.buffer.reconcile(this.latestServerState.state);
			this.latestServerState.wasConsumed = true;
		}
		// position only to be set from latest(current) buffer entry
		this.spaceShip.updateFromBuffer();
	}

	private updateDirection() {
		if (this.isSelf) {
			this.direction.set(0, 0, 0);
			if (this.app.controls.keysPressed['w'] === true) this.direction.setX(1);

			if (this.app.controls.keysPressed['s']) this.direction.setX(-1);

			if (this.app.controls.keysPressed['a']) this.direction.setZ(-1);

			if (this.app.controls.keysPressed['d']) this.direction.setZ(1);

			// this.direction.normalize();
		}

		if (!this.isSelf) {
			this.direction.set(
				this.latestServerState.state.dx,
				0,
				this.latestServerState.state.dz
			);
		}
	}

	public getCurrentState(): PlayerState {
		const state = new PlayerState();
		state.timestamp = Date.now().toString();

		state.dx = this.direction.x;
		state.dz = this.direction.z;

		state.x = this.spaceShip.position.x;
		state.y = this.spaceShip.position.y;
		state.z = this.spaceShip.position.z;

		state.qw = this.spaceShip.quaternion.w;
		state.qx = this.spaceShip.quaternion.x;
		state.qy = this.spaceShip.quaternion.y;
		state.qz = this.spaceShip.quaternion.z;

		return state;
	}
}
