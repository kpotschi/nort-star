import * as THREE from 'three';

export default class BackgroundStars {
	private scene: THREE.Scene;
	private stars: THREE.Points;
	constructor(scene: THREE.Scene) {
		this.scene = scene;
		this.init();
	}

	private init() {
		const starGeometry = new THREE.BufferGeometry();
		const starCount = 1000;
		const starVertices = [];

		for (let i = 0; i < starCount; i++) {
			const x = (Math.random() - 0.5) * 2000;
			const y = (Math.random() - 0.5) * 2000;
			const z = (Math.random() - 0.5) * 2000;

			starVertices.push(x, y, z);
		}

		starGeometry.setAttribute(
			'position',
			new THREE.Float32BufferAttribute(starVertices, 3)
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
		// Rotate the starfield to simulate movement
		if (this.stars) {
			this.stars.rotation.y += 0.01 * delta; // Adjust speed as needed
			this.stars.rotation.x += 0.005 * delta; // Optionally add rotation around x-axis
		}
	}
}
