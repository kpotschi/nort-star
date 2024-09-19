import * as THREE from 'three';
import GameScene from '../scenes/GameScene';
import { CONFIG } from '../config/config';

export default class BackgroundStars {
	private scene: GameScene;
	private stars: THREE.Points;
	private starPositions: Float32Array;

	constructor(scene: GameScene) {
		this.scene = scene;
		this.init();
	}

	private init() {
		const starGeometry = new THREE.BufferGeometry();
		const starCount = 1000;
		this.starPositions = new Float32Array(starCount * 3);

		for (let i = 0; i < starCount; i++) {
			let x, y, z, distance;

			// Generate a random point on a sphere, then scale it to be between 500 and 1000 units away from the origin
			const radius = 300 + Math.random() * 300; // Radius between 500 and 1000 units

			// Random spherical coordinates
			const theta = Math.random() * Math.PI * 2; // Random angle around the Y-axis
			const phi = Math.acos(Math.random() * 2 - 1); // Random angle from the Z-axis

			// Convert spherical coordinates to Cartesian coordinates
			x = radius * Math.sin(phi) * Math.cos(theta);
			y = radius * Math.sin(phi) * Math.sin(theta);
			z = radius * Math.cos(phi);

			// Assign the position to the star
			this.starPositions[i * 3] = x;
			this.starPositions[i * 3 + 1] = y;
			this.starPositions[i * 3 + 2] = z;
		}

		// Set positions in geometry
		starGeometry.setAttribute(
			'position',
			new THREE.Float32BufferAttribute(this.starPositions, 3)
		);

		const starMaterial = new THREE.PointsMaterial({
			color: 0xffffff,
			size: 2,
			sizeAttenuation: true,
		});

		this.stars = new THREE.Points(starGeometry, starMaterial);
		this.scene.add(this.stars);
	}

	public move(delta: number) {
		// Ensure stars exist
		if (this.stars) {
			// Set the rotation speed for the starlapse effect
			const rotationSpeed = CONFIG.BACKGROUND.ROTATION_SPEED * delta;

			// Apply rotation to the entire star field around the Y-axis (vertical axis)
			this.stars.rotation.y += rotationSpeed; // Rotate around the Y-axis

			// Optionally, you can rotate around other axes for different effects:
			this.stars.rotation.x += rotationSpeed; // Rotate around the X-axis
			// this.stars.rotation.z += rotationSpeed; // Rotate around the Z-axis
		}
	}
}
