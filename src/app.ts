import * as THREE from 'three';
import GameScene from './scenes/GameScene';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import CustomRenderer from './entities/CustomRenderer';
// import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';

if (process.env.DEBUG === 'true') {
	console.log('loaded esbuild watch listener');
	new EventSource('/esbuild').addEventListener('change', () =>
		location.reload()
	);
}
export default class App {
	public currentScene: GameScene;
	private renderer: CustomRenderer;
	public camera: THREE.PerspectiveCamera;
	public clock: THREE.Clock;

	constructor() {
		this.clock = new THREE.Clock();

		this.init();
	}

	private init() {
		this.renderer = new CustomRenderer(this);

		this.setupCamera();
		this.setupAnimationLoop();
		this.setupResizeListener();
		this.renderer.setupRenderPasses();
		this.setupDebugger();
		this.startScene();
	}

	private setupCamera() {
		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		this.camera.position.z = 5;
	}

	private setupAnimationLoop() {
		this.renderer.setAnimationLoop(this.loop.bind(this));
	}

	private loop() {
		const delta = this.clock.getDelta();
		if (this.currentScene) this.currentScene.loop(delta);

		this.renderer.render(this.currentScene, this.camera);
		// this.renderer.renderComposer();
	}

	private startScene() {
		this.currentScene = new GameScene(this);
	}

	private setupResizeListener() {
		window.addEventListener('resize', () => {
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
		});
	}
	private setupDebugger() {
		if (process.env.DEBUG === 'true') {
			// const gui = new GUI();

			// gui
			// 	.add(params, 'radius', 0.0, 1.0)
			// 	.step(0.01)
			// 	.onChange(function (value) {
			// 		bloomPass.radius = Number(value);
			// 	});

			const controls = new OrbitControls(this.camera, this.renderer.domElement);
		}
	}
}

const game = new App();
