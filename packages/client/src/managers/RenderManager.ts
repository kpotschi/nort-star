import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import App from '../app';
import { CONFIG } from '../../../../shared/config/config';

export default class RenderManager extends THREE.WebGLRenderer {
	readonly app: App;
	public composer: EffectComposer;
	public bloomPass: UnrealBloomPass;
	constructor(app: App) {
		super();
		this.app = app;
		this.setupDom();
		this.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	}

	private setupDom() {
		this.setSize(window.innerWidth, window.innerHeight);
		const gameDiv = document.getElementById('game');
		gameDiv.appendChild(this.domElement);
	}

	public setupRenderPasses() {
		const renderScene = new RenderPass(this.app.currentScene, this.app.camera);

		this.bloomPass = new UnrealBloomPass(
			new THREE.Vector2(window.innerWidth, window.innerHeight),
			1.5,
			0.4,
			0.85
		);
		this.bloomPass.threshold = CONFIG.RENDER.PASS.THRESHOLD;
		this.bloomPass.strength = CONFIG.RENDER.PASS.STRENGTH;
		this.bloomPass.radius = CONFIG.RENDER.PASS.RADIUS;

		const outputPass = new OutputPass();

		this.composer = new EffectComposer(this);
		this.composer.addPass(renderScene);
		this.composer.addPass(this.bloomPass);
		this.composer.addPass(outputPass);
	}
}
