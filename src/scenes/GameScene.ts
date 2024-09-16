import * as THREE from 'three';

import BackgroundStars from '../entities/BackgroundStars';
import App from '../app';
import Spaceship from '../entities/Spaceship';

export default class GameScene extends THREE.Scene {
	private backgroundStars: BackgroundStars;
	public app: App;
	private spaceship: Spaceship;
	private pointLight: THREE.PointLight;

	constructor(app: App) {
		super();
		this.app = app;
		this.init();
	}

	private init() {
		this.createBackground();
		this.createLighting();

		this.spaceship = new Spaceship(this);
	}

	private createLighting() {
		this.add(new THREE.AmbientLight(0xcccccc));
		this.pointLight = new THREE.PointLight(0xffffff, 50);
		this.pointLight.position.set(10, 10, 0);
		this.pointLight.castShadow = true; // Enable shadows
		const helper = new THREE.PointLightHelper(this.pointLight);
		this.add(this.pointLight);
		this.add(helper);
		this.pointLight.lookAt(0, 0, 0);
	}

	private createBackground() {
		this.backgroundStars = new BackgroundStars(this);
	}

	public loop(delta: number) {
		this.backgroundStars.move(delta);
	}
}
