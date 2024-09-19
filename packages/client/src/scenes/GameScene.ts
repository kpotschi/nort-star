import * as THREE from 'three';
import BackgroundStars from '../entities/BackgroundStars';
import App from '../app';
import Spaceship from '../entities/Spaceship';
import Obstacle from '../entities/obstacles/Obstacle';
import Sun from '../entities/Sun';

export default class GameScene extends THREE.Scene {
	private backgroundStars: BackgroundStars;
	public app: App;
	public spaceship: Spaceship | null = null; // Local player's spaceship
	public opponentSpaceships: { [id: string]: Spaceship } = {}; // Opponent spaceships
	private pointLight: THREE.PointLight;
	private obstacles: Obstacle[];
	private sun: Sun;

	constructor(app: App) {
		super();
		this.app = app;
	}

	public init() {
		this.createBackground();
		this.createLighting();
	}

	public startGame() {
		this.app.overlay.style.display = 'none';

		// Iterate through the players in the room and create a spaceship for each
		this.app.room.state.players.forEach((player: any, id: string) => {
			if (id === this.app.room.sessionId) {
				// If this is the local player's spaceship
				this.spaceship = new Spaceship(this);
				console.log(`Created spaceship for local player: ${id}`);
			} else {
				// For opponents
				const opponentSpaceship = new Spaceship(this);
				this.opponentSpaceships[id] = opponentSpaceship;
				console.log(`Created spaceship for opponent player: ${id}`);
			}
		});

		console.log('Game started with spaceships for all players.');
	}

	private createLighting() {
		this.add(new THREE.AmbientLight(0xcccccc, 0.6));
	}

	private createBackground() {
		this.backgroundStars = new BackgroundStars(this);
	}

	public loop(delta: number) {
		this.backgroundStars.move(delta);

		// Update local player's spaceship
		if (this.spaceship) {
			this.spaceship.move(delta);

			// Send local player's position to the server
			this.app.room.send('move', this.spaceship.position);
		}

		// Update opponent spaceships (positions should come from the server)
		for (const id in this.opponentSpaceships) {
			const opponentSpaceship = this.opponentSpaceships[id];
			// Assuming the opponent's position is synced from the server
			const opponentState = this.app.room.state.players.get(id);
			if (opponentState) {
				opponentSpaceship.position.set(
					opponentState.x,
					opponentState.y,
					opponentState.z
				);
			}
			opponentSpaceship.move(delta); // Optional, depending on what "move" does
		}
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
