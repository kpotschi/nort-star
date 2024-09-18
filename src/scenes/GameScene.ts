import * as THREE from 'three';
import BackgroundStars from '../entities/BackgroundStars';
import App from '../app';
import Spaceship from '../entities/Spaceship';
import Ring from '../entities/obstacles/Ring';

export default class GameScene extends THREE.Scene {
	private backgroundStars: BackgroundStars;
	public app: App;
	public spaceship: Spaceship;
	private pointLight: THREE.PointLight;
	obstacles: Ring;

	constructor(app: App) {
		super();
		this.app = app;
		this.init();
	}

	private init() {
		this.createBackground();
		this.createLighting();

		this.spaceship = new Spaceship(this);
		this.obstacles = new Ring(this);
		// const geometry = new THREE.BoxGeometry();
		// const material = new THREE.MeshStandardMaterial({
		// 	color: 0x00ff00,
		// 	metalness: 0.5, // Make sure the material interacts with light
		// 	roughness: 0.1, // Lower roughness to make it shinier
		// });
		// const cube = new THREE.Mesh(geometry, material);
		// cube.position.set(3, 0, 0);
		// this.add(cube);
	}

	private createLighting() {
		this.add(new THREE.AmbientLight(0xcccccc, 0.2));
		this.pointLight = new THREE.PointLight(0xcccccc, 100);
		this.pointLight.position.set(3, 5, 0);
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
		this.spaceship.move(delta);
		this.obstacles.move();
	}
}
