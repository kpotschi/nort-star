import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { default as App } from '../app';

export default class CustomRenderer extends THREE.WebGLRenderer {
	private app: App;
	private composer: EffectComposer;

	constructor(app: App) {
		super();
		this.app = app;
		this.init();
	}

	private init() {
		this.setupDom();
	}

	private setupDom() {
		this.setSize(window.innerWidth, window.innerHeight);
		const gameDiv = document.getElementById('game');
		gameDiv.appendChild(this.domElement);
	}

	public setupRenderPasses() {
		const renderScene = new RenderPass(this.app.currentScene, this.app.camera);

		const bloomPass = new UnrealBloomPass(
			new THREE.Vector2(window.innerWidth, window.innerHeight),
			1.5,
			0.4,
			0.85
		);
		bloomPass.threshold = 0;
		bloomPass.strength = 0.4;
		bloomPass.radius = 0.3;

		const outputPass = new OutputPass();

		this.composer = new EffectComposer(this);
		this.composer.addPass(renderScene);
		this.composer.addPass(bloomPass);
		this.composer.addPass(outputPass);
	}

	public renderComposer() {
		this.composer.render();
	}
}
