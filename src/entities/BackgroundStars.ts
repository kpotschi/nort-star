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
			this.starPositions[i * 3] = (Math.random() - 0.5) * 1000;
			this.starPositions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
			this.starPositions[i * 3 + 2] = (Math.random() - 0.5) * 1000;
		}

		starGeometry.setAttribute(
			'position',
			new THREE.Float32BufferAttribute(this.starPositions, 3)
		);

		const starMaterial = new THREE.PointsMaterial({
			color: 0xffffff,
			size: 1,
			sizeAttenuation: true,
		});

		this.stars = new THREE.Points(starGeometry, starMaterial);
		this.scene.add(this.stars);
	}

	public move(delta: number) {
		if (this.stars) {
			// Get spaceship rotation
			const rotationSpeedX = this.scene.spaceship.velocityX;
			const rotationSpeedY = this.scene.spaceship.velocityY;

			// Calculate movement
			const moveX = rotationSpeedY * CONFIG.BACKGROUND.MOVEMENT_SPEED * delta;
			const moveZ = rotationSpeedX * CONFIG.BACKGROUND.MOVEMENT_SPEED * delta;

			// Update star positions
			for (let i = 0; i < this.starPositions.length; i += 3) {
				this.starPositions[i] -= moveX;
				this.starPositions[i + 2] -= moveZ;
			}
			console.log(this.starPositions);

			this.stars.geometry.attributes.position.needsUpdate = true;
		}
	}
}
