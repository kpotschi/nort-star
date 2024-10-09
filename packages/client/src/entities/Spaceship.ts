import { CONFIG } from './../config/config';
import * as THREE from 'three';
import { PlayerState } from '../../../server/src/rooms/schema/MyRoomState';
import App from '../app';
import StateBuffer from '../managers/StateBuffer';
import GameScene from '../scenes/GameScene';
import Player from './Player';

export default class Spaceship extends THREE.Mesh {
	protected scene: GameScene;
	public direction: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
	public serverPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
	// public serverQ: THREE.Quaternion = new THREE.Quaternion(0, 0, 1);
	public stateBuffer: StateBuffer;
	// private speed: number = 10;
	readonly player: Player;
	private lastSendTime: number = 0; // Time of the last server update
	readonly sendRate: number = 500; // Send update every 100ms (10 times per second)

	constructor(scene: GameScene, player: Player, playerState?: PlayerState) {
		const material = Spaceship.getMaterial();
		const geometry = Spaceship.getGeometry();
		super(geometry, material);
		this.stateBuffer = new StateBuffer();
		this.player = player;
		this.scene = scene;
		this.scene.add(this);

		if (playerState) {
			this.position.set(playerState.x, playerState.y, 0);
			this.lookAt(0, 0, 0);
		}
	}

	static getMaterial(): THREE.Material {
		return new THREE.MeshStandardMaterial({
			color: 0x00ff00,
			metalness: 0, // Make it interact with light properly
			roughness: 0.1, // Shiny appearance
			// side: THREE.DoubleSide, // Render both sides of the faces
		});
	}

	static getGeometry(): THREE.BufferGeometry {
		const geometry = new THREE.BufferGeometry();
		const vertices = new Float32Array([
			0,
			0,
			2, // 1 front
			1,
			0,
			0, // 1 left
			0,
			0.5,
			0, // 1 top

			-1,
			0,
			0, // 2 right
			0,
			0,
			2, // 2 front
			0,
			0.5,
			0, // 2 top
			0,
			0,
			-1, // 3 back
			0,
			0.5,
			0, // 3 top
			1,
			0,
			0, // 3 left
			0,
			0,
			-1, // 4 back
			-1,
			0,
			0, // 4 right
			0,
			0.5,
			0, // 4 top
			0,
			0,
			2, // 5 front
			0,
			-0.5,
			0, // 5 bottom
			1,
			0,
			0, // 5 left
			0,
			0,
			2, // 6 front
			-1,
			0,
			0, // 6 right
			0,
			-0.5,
			0, // 6 bottom
			0,
			0,
			-1, // 7 back
			1,
			0,
			0, // 7 left
			0,
			-0.5,
			0, // 7 bottom
			0,
			0,
			-1, // 8 back
			0,
			-0.5,
			0, // 8 bottom

			-1,
			0,
			0, // 8 right
		]);

		geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
		geometry.computeVertexNormals();
		return geometry;
	}

	public update(deltaMs: number) {
		// Only handle input and movement if the player is controlling this spaceship
		if (this.player.isSelf) {
			this.process(deltaMs);
		}
	}

	private process(deltaMs: number) {
		console.log('client', this.position.x, this.position.y);

		// Check for user input
		let { dx, dy } = this.handleInput();

		const state = new PlayerState();

		this.position.setX(this.position.x + (dx * deltaMs) / 100);
		this.position.setY(this.position.y + (dy * deltaMs) / 100);

		// // client prediction of movement

		// // Update predicted state locally
		// state.x = newX;
		// state.y = newY;

		// Save state and predicted input to local buffer
		// this.scene.app.playerManager.localBuffer.add(state);

		// Move ship to predicted coordinates locally
		// this.position.set(newX, newY, 0);

		// Send update to the server at a limited rate (throttle)
		const currentTime = Date.now();
		if (currentTime - this.lastSendTime > this.sendRate) {
			this.processState(state, dx, dy);
			this.lastSendTime = currentTime; // Update last send time
		}
	}

	private processState(playerState: PlayerState, dx: number, dy: number) {
		// Set properties on the instance
		// playerState.x = this.position.x;
		// playerState.y = this.position.y;
		playerState.dx = dx;
		playerState.dy = dy;
		playerState.timestamp = Date.now().toString(); // Set timestamp as string

		this.scene.app.currentScene.room.send<PlayerState>('move', playerState);
	}

	private handleInput() {
		let dx = 0;
		let dy = 0;

		if (this.scene.app.controls.keysPressed['w']) {
			dy += 1; // Forward
		}
		if (this.scene.app.controls.keysPressed['s']) {
			dy -= 1; // Backward
		}
		if (this.scene.app.controls.keysPressed['d']) {
			dx -= 1; // Left
		}
		if (this.scene.app.controls.keysPressed['a']) {
			dx += 1; // Right
		}

		// Normalize to prevent faster diagonal movement
		const length = Math.sqrt(dx * dx + dy * dy);
		if (length > 0) {
			dx /= length;
			dy /= length;
		}
		return { dx, dy };
	}
}
