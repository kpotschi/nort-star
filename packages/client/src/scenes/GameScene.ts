import * as THREE from 'three';
import BackgroundStars from '../entities/BackgroundStars';
import App from '../app';
import Spaceship from '../entities/Spaceship';
import Obstacle from '../entities/obstacles/Obstacle';
import Ring from '../entities/obstacles/Ring';
import Sun from '../entities/Sun';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export default class GameScene extends THREE.Scene {
	private backgroundStars: BackgroundStars;
	public app: App;
	public spaceship: Spaceship;
	private pointLight: THREE.PointLight;
	private obstacles: Obstacle[];
	private sun: Sun;
	private overlay: HTMLElement;

	constructor(app: App) {
		super();
		this.app = app;
	}

	public init() {
		this.createBackground();
		this.createLighting();
	}

	private createLighting() {
		this.add(new THREE.AmbientLight(0xcccccc, 0.6));
	}

	private createBackground() {
		this.backgroundStars = new BackgroundStars(this);
	}

	public loop(delta: number) {
		this.backgroundStars.move(delta);
		// this.spaceship.move(delta);
		// this.obstacles.forEach((obs: Obstacle) => obs.update());
		// this.sun.update(delta);
	}
}
