import { buffer } from './../../../../node_modules/@types/three/src/Three.TSL.d';
import { CONFIG } from './../config/config';
import * as THREE from 'three';
import { PlayerState } from '../../../server/src/rooms/schema/MyRoomState';
import PlayerManager from '../managers/PlayerManager';
import StateBuffer from '../managers/StateBuffer';
import GameScene from '../scenes/GameScene';
import Player from './Player';

export default class Spaceship extends THREE.Mesh {
	protected scene: GameScene;
	readonly playerManager: PlayerManager;
	readonly player: Player;
	private currentSpeed: number;

	constructor(scene: GameScene, player: Player) {
		const material = Spaceship.getMaterial();
		const geometry = Spaceship.getGeometry();
		super(geometry, material);
		this.player = player;
		this.currentSpeed = CONFIG.GAMEPLAY.START_SPEED;

		this.scene = scene;
		this.scene.add(this);
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

		// Define unique vertices
		const vertices = new Float32Array([
			// Front point
			0,
			0,
			2, // 0: nose

			// Middle ring
			1,
			0,
			0, // 1: middle left
			0,
			0.5,
			0, // 2: middle top
			-1,
			0,
			0, // 3: middle right
			0,
			-0.5,
			0, // 4: middle bottom

			// Back point
			0,
			0,
			-1, // 5: back
		]);

		// Define triangles using indices
		const indices = [
			// Front triangles (nose cone)
			0,
			1,
			2, // front-left-top
			0,
			2,
			3, // front-right-top
			0,
			4,
			1, // front-bottom-left
			0,
			3,
			4, // front-bottom-right

			// Middle to back triangles (rear cone)
			5,
			2,
			1, // back-top-left
			5,
			3,
			2, // back-top-right
			5,
			1,
			4, // back-bottom-left
			5,
			4,
			3, // back-bottom-right
		];

		// Set attributes
		geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
		geometry.setIndex(indices);

		// Compute normals for proper lighting
		geometry.computeVertexNormals();

		return geometry;
	}

	public updateRotation(deltaMs: number) {
		this.rotateOnAxis(
			this.player.direction,
			THREE.MathUtils.degToRad(CONFIG.CONTROLS.PITCH_SPEED) * deltaMs
		);
	}

	public predictPosition(deltaMs: number): void {
		// Calculate movement speed based on delta time
		const moveAmount = (this.currentSpeed * deltaMs) / 100;

		// Create a forward vector (default forward is along Z-axis in THREE.js)
		const forwardVector = new THREE.Vector3(0, 0, 1);

		// Apply the ship's quaternion rotation to the forward vector
		// This transforms the forward direction based on the ship's orientation
		forwardVector.applyQuaternion(this.quaternion);

		// Normalize the vector to ensure consistent speed regardless of direction
		forwardVector.normalize();

		// Scale by move amount
		forwardVector.multiplyScalar(moveAmount);

		// Add the movement to the current position
		this.position.add(forwardVector);
	}

	public updateFromBuffer() {
		const state = this.player.buffer.getLatestState();

		if (state) {
			this.position.set(state.x, state.y, state.z);
		}
	}
}
