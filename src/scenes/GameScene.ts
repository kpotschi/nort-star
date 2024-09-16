import * as THREE from 'three';

import BackgroundStars from '../entities/BackgroundStars';
import App from '../app';

export default class GameScene extends THREE.Scene {
	private backgroundStars: BackgroundStars;
	public app: App;

	constructor(app: App) {
		super();
		this.app = app;
		this.init();
	}

	private init() {
		this.createBackground();
		this.createLighting();
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(geometry, material);
		this.add(cube);
	}

	private createLighting() {
		this.add(new THREE.AmbientLight(0xcccccc));
		const pointLight = new THREE.PointLight(0xffffff, 80);
		pointLight.position.set(2, 2, 2);
		this.add(pointLight);
	}

	private createBackground() {
		this.backgroundStars = new BackgroundStars(this);
	}

	public loop(delta: number) {
		this.backgroundStars.move(delta);
	}
}
