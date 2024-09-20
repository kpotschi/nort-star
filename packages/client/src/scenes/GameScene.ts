import * as THREE from 'three';
import BackgroundStars from '../entities/BackgroundStars';
import App from '../app';
import Spaceship from '../entities/Spaceship';
import Obstacle from '../entities/obstacles/Obstacle';
import Sun from '../entities/Sun';
import PlayerShip from '../entities/PlayerShip';
import { Room } from 'colyseus.js';
import { Player, State } from '../../../server/src/rooms/schema/MyRoomState';
import { Spawn } from '../config/types';

export default class GameScene extends THREE.Scene {
	private backgroundStars: BackgroundStars;
	public app: App;
	public spaceship: PlayerShip | null = null;
	public opponentSpaceships: { [id: string]: Spaceship } = {};
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

	public startGame() {
		this.app.ui.unsetWarning();

		this.app.client.setupPositionListener();
	}

	private createLighting() {
		this.add(new THREE.AmbientLight(0xcccccc, 0.6));
	}

	private createBackground() {
		this.backgroundStars = new BackgroundStars(this);
	}

	public spawnSelf(spawn: Spawn) {
		this.spaceship = new PlayerShip(this, spawn);
	}

	public spawnOpponent(id: string, player: Player) {
		const opponentSpaceship = new Spaceship(this, player);
		this.opponentSpaceships[id] = opponentSpaceship;
		console.log(`Created spaceship for opponent player: ${id}`);
	}

	public loop(delta: number) {
		// this.backgroundStars && this.backgroundStars.move(delta);
		// // Update local player's spaceship
		if (this.spaceship) {
			this.spaceship.move(delta);
		}
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

	// Remove a spaceship when an opponent leaves
	public removePlayer(id: string) {
		if (this.opponentSpaceships[id]) {
			this.remove(this.opponentSpaceships[id]); // Remove spaceship from scene
			delete this.opponentSpaceships[id]; // Remove spaceship from dictionary
			console.log(`Opponent player ${id} has left. Spaceship removed.`);
		}
	}
}
