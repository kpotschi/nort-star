import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import App from '../app';

export default class DebugManager extends GUI {
	readonly app: App;
	public stats: Stats;
	public gui: GUI;
	private orbitControls: OrbitControls;

	constructor(app: App) {
		super();
		this.app = app;
		this.addStats();
		this.gui = new GUI();
		this.initGui();
		this.initControls();
		this.initConnectionDebug();
	}

	private initConnectionDebug() {
		this.gui.add(this.app.client, 'listenToServerUpdates');
	}

	private addStats() {
		this.stats = new Stats();
		this.app.renderer.domElement.appendChild(this.stats.dom);
	}

	private initControls() {
		this.orbitControls = new OrbitControls(
			this.app.camera,
			this.app.renderer.domElement
		);
	}

	private initDirection() {
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

		bloomFolder
			.add(this.app.renderer.bloomPass, 'radius', 0.0, 1.0)
			.step(0.01)
			.onChange((value) => {
				this.app.renderer.bloomPass.radius = Number(value);
			});
	}

	public update() {
		// this.orbitControls.target = this.app.playerManager.self?.spaceShip.position;
	}
}
