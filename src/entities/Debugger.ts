import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import App from '../app';
import { CONFIG } from '../config/config';

export default class Debugger extends GUI {
	private app: App;
	public stats: Stats;

	constructor(app: App) {
		super();
		this.app = app;
		this.addStats();
		this.init();
	}

	private addStats() {
		this.stats = new Stats();
		this.app.renderer.domElement.appendChild(this.stats.dom);
	}

	private init() {
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

		const controls = new OrbitControls(
			this.app.camera,
			this.app.renderer.domElement
		);
	}
}
