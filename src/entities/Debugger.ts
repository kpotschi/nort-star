import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import App from '../app';
import { CONFIG } from '../config/config';
import * as THREE from 'three';
import Spaceship from './Spaceship';

export default class Debugger extends GUI {
	private app: App;
	public stats: Stats;
	private controls: OrbitControls;
	private spaceship: Spaceship;

	constructor(app: App) {
		super();
		this.app = app;
		this.spaceship = app.currentScene.spaceship;
		this.addStats();
		this.init();
	}

	private addStats() {
		this.stats = new Stats();
		this.app.renderer.domElement.appendChild(this.stats.dom);
	}

	private init() {
		// this.initControls();
		this.initGui();
		// this.initDirection();
	}
	private initControls() {
		this.controls = new OrbitControls(
			this.app.camera,
			this.app.renderer.domElement
		);
	}

	private initDirection() {
		// const shipDirection = this.spaceship.direction;

		const origin = new THREE.Vector3(0, 0, 0);
		const length = 3;

		const x = new THREE.ArrowHelper(
			new THREE.Vector3(1, 0, 0),
			origin,
			length,
			0xffff00
		);

		const y = new THREE.ArrowHelper(
			new THREE.Vector3(0, 1, 0),
			origin,
			length,
			0xff0000
		);
		const z = new THREE.ArrowHelper(
			new THREE.Vector3(0, 0, 1),
			origin,
			length,
			0x00ff00
		);
		this.app.currentScene.add(x, y, z);
	}
	private initGui() {
		const bloomFolder = this.addFolder('bloom');

		bloomFolder
			.add(this.app.renderer.bloomPass, 'threshold', 0.0, 1.0)
			.onChange((value) => {
				this.app.renderer.bloomPass.threshold = Number(value);
			});

		bloomFolder
			.add(this.app.renderer.bloomPass, 'strength', 0.0, 3.0)
			.onChange((value) => {
				this.app.renderer.bloomPass.strength = Number(value);
			});

		this.add(this.app.renderer.bloomPass, 'radius', 0.0, 1.0)
			.step(0.01)
			.onChange((value) => {
				this.app.renderer.bloomPass.radius = Number(value);
			});

		const toneMappingFolder = this.addFolder('tone mapping');

		toneMappingFolder
			.add(CONFIG.RENDER.PASS, 'EXPOSURE', 0.1, 2)
			.onChange((value) => {
				this.app.renderer.toneMappingExposure = Math.pow(value, 4.0);
			});
	}
}
