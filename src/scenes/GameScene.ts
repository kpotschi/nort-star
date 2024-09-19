import * as THREE from 'three';
import BackgroundStars from '../entities/BackgroundStars';
import App from '../app';
import Spaceship from '../entities/Spaceship';
import Obstacle from '../entities/obstacles/Obstacle';
import Ring from '../entities/obstacles/Ring';
import Sun from '../entities/Sun';

export default class GameScene extends THREE.Scene {
	private backgroundStars: BackgroundStars;
	public app: App;
	public spaceship: Spaceship;
	private pointLight: THREE.PointLight;
	private obstacles: Obstacle[];
	private sun: Sun;

	constructor(app: App) {
		super();
		this.app = app;
		this.init();
	}

	private init() {
		this.createBackground();
		this.createLighting();

		this.spaceship = new Spaceship(this);

		this.obstacles = [];

		for (let i = 0; i < 10; i++) {
			this.obstacles.push(new Ring(this, i));
		}
		this.sun = new Sun(this);
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
		this.add(new THREE.AmbientLight(0xcccccc, 0.6));
	}

	private createBackground() {
		// this.backgroundStars = new BackgroundStars(this);
	}

	public loop(delta: number) {
		// this.backgroundStars.move(delta);
		this.spaceship.move(delta);
		this.obstacles.forEach((obs: Obstacle) => obs.update());
		this.sun.update(delta);
	}
}
