import * as THREE from 'three';
import CONFIG from '../CONFIG_CLIENT';
import PlayerManager from '../managers/PlayerManager';
import GameScene from '../scenes/GameScene';
import Player from './Player';
import { getForwardMovement } from '../../../../shared/physics/movement';

export default class Spaceship extends THREE.Mesh {
	declare material: THREE.MeshStandardMaterial;
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

	static getMaterial(): THREE.MeshStandardMaterial {
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

	public setColor(color: string) {
		console.log(color);
		this.material.color = new THREE.Color(color);
	}

	public updatePosition(deltaMs: number): void {}

	public updateFromBuffer() {
		const state = this.player.buffer.getLatestState();

		if (state) {
			this.quaternion.set(state.qx, state.qy, state.qz, state.qw);
			this.position.set(state.x, state.y, state.z);
		}
	}
}
