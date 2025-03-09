import { Room } from 'colyseus.js';
import * as THREE from 'three';
import {
	PlayerState,
	State,
} from '../../../server/src/rooms/schema/MyRoomState';
import App from '../app';
import CONFIG from '../CONFIG_CLIENT';
import BackgroundStars from '../entities/BackgroundStars';
import Obstacle from '../entities/obstacles/Obstacle';
import Sun from '../entities/Sun';

export default class GameScene extends THREE.Scene {
	private backgroundStars: BackgroundStars;
	public app: App;
	readonly sendRate: number = CONFIG.SERVER_RECON.HEARTBEAT_MS;

	private lastHeartBeatTime: number = 0;
	private pointLight: THREE.PointLight;
	private obstacles: Obstacle[];
	private sun: Sun;
	public room: Room<State>;

	constructor(app: App) {
		super();
		this.app = app;
	}

	public init() {
		this.createBackground();
		this.createLighting();
		this.room = this.app.client.room;
	}

	private createLighting() {
		this.add(new THREE.AmbientLight(0xcccccc, 0.3));

		this.add(new THREE.DirectionalLight(0xffffff, 1));
	}

	private createBackground() {
		this.backgroundStars = new BackgroundStars(this);
	}

	public update(deltaMs: number) {
		// this.backgroundStars && this.backgroundStars.move(delta);

		this.app.playerManager.update(deltaMs);
		this.updateHeartBeat();
	}

	private updateHeartBeat() {
		const currentTime = Date.now();

		if (currentTime - this.lastHeartBeatTime > this.sendRate) {
			this.sendServerUpdate();

			this.lastHeartBeatTime = currentTime; // Update last send time
		}
	}

	public sendServerUpdate() {
		const currentState = this.app?.playerManager?.self?.getCurrentState();

		this.room?.send<PlayerState>('move', currentState);
	}
}
