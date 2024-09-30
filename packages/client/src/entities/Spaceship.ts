import App from '../app';
import { Spawn } from '../config/types';
import GameScene from '../scenes/GameScene';
import * as THREE from 'three';

export default class Spaceship extends THREE.Mesh {
	protected scene: GameScene;
	public direction: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
	protected app: App;
	public serverPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
	public serverQ: THREE.Quaternion = new THREE.Quaternion(0, 0, 1);

	constructor(scene: GameScene, spawn?: Spawn) {
		const material = Spaceship.getMaterial();
		const geometry = Spaceship.getGeometry();
		super(geometry, material);

		this.scene = scene;
		this.scene.add(this);

		if (spawn) {
			this.position.set(spawn.x, spawn.y, spawn.z);
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

	move(delta: number) {
		console.log(this.serverPosition);

		const direction = new THREE.Vector3(0, 0, 1)
			.applyQuaternion(this.quaternion)
			.normalize();

		const speed = 10; // You can make this configurable per player if needed
		const forwardMovement = direction.multiplyScalar((speed * delta) / 1000); // divide delta by 1000 to convert ms to seconds

		// this.position.set(forwardMovement.x, forwardMovement.y, forwardMovement.z);
		this.position.lerp(this.serverPosition, 0.2);
		this.quaternion.slerp(
			new THREE.Quaternion(
				this.serverQ.x,
				this.serverQ.y,
				this.serverQ.z,
				this.serverQ.w
			),
			0.2
		);
	}
}
