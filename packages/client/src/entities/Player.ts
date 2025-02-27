import * as THREE from 'three';
import App from '../app';
import PlayerManager from '../managers/PlayerManager';
import { PlayerState } from './../../../server/src/rooms/schema/MyRoomState';
import Spaceship from './Spaceship';
import { CONFIG } from '../config/config';

export default class Player {
	readonly app: App;
	public isSelf: boolean = false;
	public spaceShip: Spaceship;
	public state: PlayerState;
	readonly playerManager: PlayerManager;
	public velocity: THREE.Vector3;

	constructor(
		app: App,
		playerState: PlayerState,
		playerManager: PlayerManager,
		isSelf = false
	) {
		this.app = app;
		this.velocity = new THREE.Vector3(0, 0, 0);
		this.state = playerState;
		this.isSelf = isSelf;
		this.playerManager = playerManager;
		this.spaceShip = new Spaceship(app.currentScene, this.playerManager);
		this.writeInitialBufferRecord();
	}

	public update(deltaMs: number) {
		if (this.isSelf) {
			this.playerManager.updateState(deltaMs);
			this.spaceShip.updatePosition();
		} else {
			this.spaceShip.move(deltaMs);
		}
	}

	public predictPosition(deltaMs: number) {
		const latest = this.playerManager.localBuffer.getLatestState();
		if (!latest) return;

		return {
			x: latest.x + (this.velocity.x * deltaMs) / 100,
			y: latest.y + (this.velocity.y * deltaMs) / 100,
			z: latest.z + deltaMs / 100,
		};
	}

	private writeInitialBufferRecord() {
		this.playerManager.localBuffer.add(new PlayerState());
	}

	public updateBasedOnServer() {
		this.spaceShip.setVelocity(this.state.dx, this.state.dy, this.state.dz);

		this.spaceShip.position.x +=
			(this.state.x - this.spaceShip.position.x) * 0.3;
		this.spaceShip.position.y +=
			(this.state.y - this.spaceShip.position.y) * 0.3;
		this.spaceShip.position.z +=
			(this.state.z - this.spaceShip.position.z) * 0.3;
	}
}
