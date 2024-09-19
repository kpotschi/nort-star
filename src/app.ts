import * as THREE from 'three';
import CustomRenderer from './entities/CustomRenderer';
import Debugger from './entities/Debugger';
import GameScene from './scenes/GameScene';
import CustomCamera from './entities/CustomCamera';

if (process.env.DEBUG === 'true') {
	console.log('loaded esbuild watch listener');
	new EventSource('/esbuild').addEventListener('change', () =>
		location.reload()
	);
}
export default class App {
	public currentScene: GameScene;
	public renderer: CustomRenderer;
	public camera: CustomCamera;
	public clock: THREE.Clock;
	public debugger: Debugger;
	public keysPressed: {} = {};
	constructor() {
		this.clock = new THREE.Clock();
		this.init();
	}

	private init() {
		this.renderer = new CustomRenderer(this);
		this.camera = new CustomCamera(this);
		this.setupAnimationLoop();
		this.setupResizeListener();
		this.startScene();
		this.renderer.setupRenderPasses();
		this.createControls();
		this.setupDebugger();
	}

	private createControls() {
		window.addEventListener('keydown', (event) => {
			this.keysPressed[event.key.toLowerCase()] = true;
		});
		window.addEventListener('keyup', (event) => {
			this.keysPressed[event.key.toLowerCase()] = false;
		});
	}

	private setupAnimationLoop() {
		this.renderer.setAnimationLoop(this.loop.bind(this));
	}

	private loop() {
		const delta = this.clock.getDelta();
		this.camera.update();
		if (this.currentScene) this.currentScene.loop(delta);
		if (this.debugger) this.debugger.stats.update();
		this.renderer.composer.render();
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
			this.debugger = new Debugger(this);
		}
	}
}

const game = new App();
