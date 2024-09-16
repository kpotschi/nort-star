import GameScene from '../scenes/GameScene';
import * as THREE from 'three';

export default class Spaceship extends THREE.Mesh {
	private scene: GameScene;
	constructor(scene: GameScene) {
		const material = Spaceship.getMaterial();
		const geometry = Spaceship.getGeometry();
		super(geometry, material);
		this.scene = scene;
		this.init();
	}

	private init() {
		this.scene.add(this);
	}

	static getMaterial(): THREE.Material {
		return new THREE.MeshStandardMaterial({
			color: 0x00ff00,
			// wireframe: true,
			side: THREE.DoubleSide, // Render both sides of the faces
		});
	}
	static getGeometry(): THREE.BufferGeometry {
		const geometry = new THREE.BufferGeometry();
		const vertices = new Float32Array([
			0,
			0,
			2, // tip front
			-1,
			0,
			0, // left
			1,
			0,
			0, // right
			0,
			-0.5,
			0, // bottom
			0,
			0.5,
			0, // top
			0,
			0,
			-1, // tip back
		]);

		// Define the faces of the diamond shape
		const indices = [
			0, 1, 3, 0, 2, 3, 0, 1, 4, 0, 2, 4, 5, 1, 3, 5, 2, 3, 5, 1, 4, 5, 2, 4,
		];

		// Create the buffer attributes
		geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
		geometry.setIndex(indices);

		return geometry;
	}
}
