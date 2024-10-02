import { Room } from 'colyseus.js';
import * as THREE from 'three';
import { State } from '../../../server/src/rooms/schema/MyRoomState';
import App from '../app';
import BackgroundStars from '../entities/BackgroundStars';
import Obstacle from '../entities/obstacles/Obstacle';
import Sun from '../entities/Sun';
import Player from '../entities/Player';

export default class GameScene extends THREE.Scene {
	private backgroundStars: BackgroundStars;
	public app: App;

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
		this.add(new THREE.AmbientLight(0xcccccc, 0.6));
	}

	private createBackground() {
		this.backgroundStars = new BackgroundStars(this);
	}

	public update(delta: number) {
		// this.backgroundStars && this.backgroundStars.move(delta);
		// // Update local player's spaceship
		this.app.playerManager.update(delta);
		// // Update opponent spaceships (positions should come from the server)
		// for (const id in this.opponentSpaceships) {
		// 	const opponentSpaceship = this.opponentSpaceships[id];
		// 	// Assuming the opponent's position is synced from the server
		// 	const opponentState = this.room.state.players.get(id);
		// 	if (opponentState) {
		// 		opponentSpaceship.position.set(
		// 			opponentState.x,
		// 			opponentState.y,
		// 			opponentState.z
		// 		);
		// 	}
		// 	// opponentSpaceship.move(delta); // Optional, depending on what "move" does
		// }
	}
}
