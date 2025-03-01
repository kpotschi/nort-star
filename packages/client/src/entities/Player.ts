import * as THREE from 'three';
import App from '../app';
import PlayerManager from '../managers/PlayerManager';
import { PlayerState } from './../../../server/src/rooms/schema/MyRoomState';
import Spaceship from './Spaceship';
import { CONFIG } from '../config/config';
import StateBuffer from '../managers/StateBuffer';

export default class Player {
	readonly app: App;
	public isSelf: boolean = false;
	public spaceShip: Spaceship;
	public state: PlayerState;
	readonly playerManager: PlayerManager;
	private buffer: StateBuffer;
	private currentSpeed: number;
	public velocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
	public position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
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
		this.currentSpeed = CONFIG.GAMEPLAY.START_SPEED;
		this.velocity = new THREE.Vector3(0, 0, 0);
		this.isSelf = isSelf;
		this.playerManager = playerManager;
		this.spaceShip = new Spaceship(app.currentScene, this);
		this.latestServerState.wasConsumed = false;
		this.latestServerState.state = serverState;
		// set initial buffer record for spawn
		this.position.set(serverState.x, serverState.y, serverState.z);
		this.buffer.add(serverState);
	}

	public update(deltaMs: number) {
		// set enemy velocity based on last server update
		if (!this.isSelf)
			this.velocity.set(
				this.latestServerState.state.dx,
				this.latestServerState.state.dy,
				this.velocity.z
			);

		// predict position and change this.position
		this.predictPosition(deltaMs);

		const currentState = this.getCurrentState();

		this.buffer.add(currentState);

		// reconcile from server update
		if (this.latestServerState.wasConsumed === false) {
			this.reconcilePosition(this.latestServerState.state);
			this.latestServerState.wasConsumed = true;
		}

		// position only to be set from latest(current) buffer entry
		const bufferEntry = this.buffer[this.buffer.length - 1];

		this.position.set(bufferEntry.x, bufferEntry.y, bufferEntry.z);
		this.spaceShip.update();

		// this.predictPosition(deltaMs);
		// if (this.isSelf) {
		// 	this.playerManager.updateState(deltaMs);
		// 	this.spaceShip.updatePosition();
		// } else {
		// this.spaceShip.move(deltaMs);
		// this.buffer.addLatest();
		// }
		// if (!this.isSelf) console.log(this.position.z);
	}

	public reconcilePosition(serverState: PlayerState) {
		this.buffer.reconcile(serverState);
	}

	public getLatestState(): PlayerState {
		return this.buffer[this.buffer.length - 1];
	}

	public getCurrentState(): PlayerState {
		const state = new PlayerState();
		state.dx = this.velocity.x;
		state.dy = this.velocity.y;
		state.timestamp = Date.now().toString();
		state.x = this.position.x;
		state.y = this.position.y;
		state.z = this.position.z;
		return state;
	}

	public predictPosition(deltaMs: number): void {
		this.position.x += (this.velocity.x * deltaMs) / 100;
		this.position.y += (this.velocity.y * deltaMs) / 100;
		this.position.z += (this.currentSpeed * deltaMs) / 100;
	}

	// public updateBasedOnServer() {
	// 	this.velocity.set(this.state.dx, this.state.dy, this.state.dz);

	// 	this.spaceShip.position.lerp(
	// 		{ x: this.state.x, y: this.state.y, z: this.state.z },
	// 		0.5
	// 	);
	// }
}
