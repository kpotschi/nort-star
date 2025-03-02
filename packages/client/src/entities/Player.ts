import * as THREE from 'three';
import App from '../app';
import PlayerManager from '../managers/PlayerManager';
import StateBuffer from '../managers/StateBuffer';
import { PlayerState } from './../../../server/src/rooms/schema/MyRoomState';
import Spaceship from './Spaceship';

export default class Player {
	readonly app: App;
	public isSelf: boolean = false;
	public spaceShip: Spaceship;
	public state: PlayerState;
	readonly playerManager: PlayerManager;
	public buffer: StateBuffer;

	public direction: THREE.Vector3 = new THREE.Vector3(0, 0, 1);

	public latestServerState: { state: PlayerState; wasConsumed: boolean } = {
		state: null,
		wasConsumed: null,
	};

	constructor(
		app: App,
		serverState: PlayerState,
		playerManager: PlayerManager,
		isSelf = false
	) {
		this.buffer = new StateBuffer(this, serverState);
		this.app = app;
		// this.velocity = new THREE.Vector3(0, 0, 0);
		this.isSelf = isSelf;
		this.playerManager = playerManager;
		this.spaceShip = new Spaceship(app.currentScene, this);
		this.spaceShip.position.set(serverState.x, serverState.y, serverState.z);

		this.latestServerState.wasConsumed = false;
		this.latestServerState.state = serverState;
		// set initial buffer record for spawn
		this.buffer.add(serverState);
	}

	public update(deltaMs: number) {
		// set enemy velocity based on last server update
		this.updateDirection();

		// apply rotation based on input
		if (this.isSelf) {
			this.spaceShip.updateRotation(deltaMs);
		}

		// predict position and change this.position
		this.spaceShip.predictPosition(deltaMs);
		// this.spaceShip.quaternion.setFromEuler(this.rotation);
		const currentState = this.getCurrentState();
		this.buffer.add(currentState);
		// reconcile position from server update
		if (this.latestServerState.wasConsumed === false) {
			this.reconcilePosition(this.latestServerState.state);
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

			this.direction.normalize();
		}

		if (!this.isSelf) {
			this.direction.set(
				this.latestServerState.state.dx,
				0,
				this.latestServerState.state.dz
			);
		}
	}

	public reconcilePosition(serverState: PlayerState) {
		this.buffer.reconcile(serverState);
	}

	public getCurrentState(): PlayerState {
		const state = new PlayerState();
		state.timestamp = Date.now().toString();

		state.dx = this.direction.x;
		state.dy = this.direction.y;

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
