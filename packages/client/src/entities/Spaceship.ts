import { Vector3 } from './../../../server/node_modules/@types/three/src/math/Vector3.d';
import { CONFIG } from './../config/config';
import * as THREE from 'three';
import { PlayerState } from '../../../server/src/rooms/schema/MyRoomState';
import PlayerManager from '../managers/PlayerManager';
import StateBuffer from '../managers/StateBuffer';
import GameScene from '../scenes/GameScene';

export default class Spaceship extends THREE.Mesh {
	protected scene: GameScene;
	private velocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
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
		// this.stateBuffer = new StateBuffer();
		this.scene = scene;
		this.scene.add(this);

		if (playerState) {
			this.position.set(playerState.x, playerState.y, playerState.z);
			this.lookAt(0, 0, 0);
		}
	}

	public setVelocity(x: number, y: number, z: number) {
		this.velocity.set(x, y, z);
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

	public updatePosition() {
		const localBuffer = this.playerManager.localBuffer;
		if (localBuffer.isEmpty()) return;
		// Get the latest reconciled state
		const latestState = localBuffer.buffer[localBuffer.buffer.length - 1];
		// Set the spaceship's position to the latest state's position

		this.position.set(latestState.x, latestState.y, latestState.z);
	}

	public move(deltaMs: number) {
		this.position.x += (this.velocity.x * deltaMs) / 100;
		this.position.y += (this.velocity.y * deltaMs) / 100;
		this.position.z += (CONFIG.GAMEPLAY.START_SPEED * deltaMs) / 100;
	}
}
