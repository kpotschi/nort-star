import { CONFIG } from './../config/config';
import * as THREE from 'three';
import { PlayerState } from '../../../server/src/rooms/schema/MyRoomState';
import App from '../app';
import StateBuffer from '../managers/StateBuffer';
import GameScene from '../scenes/GameScene';
import Player from './Player';
import PlayerManager from '../managers/PlayerManager';

export default class Spaceship extends THREE.Mesh {
	protected scene: GameScene;
	public direction: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
	public serverPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
	// public serverQ: THREE.Quaternion = new THREE.Quaternion(0, 0, 1);
	public stateBuffer: StateBuffer;
	// private speed: number = 10;
	private lastSendTime: number = 0; // Time of the last server update
	readonly sendRate: number = 500; // Send update every 100ms (10 times per second)
	readonly playerManager: PlayerManager;

	constructor(
		scene: GameScene,
		playerManager: PlayerManager,
		playerState?: PlayerState
	) {
		const material = Spaceship.getMaterial();
		const geometry = Spaceship.getGeometry();
		super(geometry, material);
		this.playerManager = playerManager;
		this.stateBuffer = new StateBuffer();
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
		if (this.playerManager.self.isSelf) {
			this.process(deltaMs);
			this.updatePosition();
		}
	}

	private process(deltaMs: number) {
		let { dx, dy } = this.handleInput();

		const { x, y } = this.predictPosition(dx, deltaMs, dy);

		const state = new PlayerState();

		state.dx = dx;
		state.dy = dy;
		state.timestamp = Date.now().toString(); // Set timestamp as string
		state.x = x;
		state.y = y;

		this.playerManager.localBuffer.add(state);

		const currentTime = Date.now();
		if (currentTime - this.lastSendTime > this.sendRate) {
			this.scene.app.currentScene.room.send<PlayerState>('move', state);
			this.lastSendTime = currentTime; // Update last send time
		}
	}

	private predictPosition(dx: number, deltaMs: number, dy: number) {
		return {
			x: this.position.x + (dx * deltaMs) / 100,
			y: this.position.y + (dy * deltaMs) / 100,
		};
	}

	private updatePosition() {
		const localBuffer = this.playerManager.localBuffer;
		if (localBuffer.isEmpty()) return;

		// Get the latest reconciled state
		const latestState = localBuffer.buffer[localBuffer.buffer.length - 1];

		// Set the spaceship's position to the latest state's position
		this.position.set(latestState.x, latestState.y, 0);
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
