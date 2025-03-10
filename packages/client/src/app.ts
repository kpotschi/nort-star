import * as THREE from 'three';
import CameraManager from './managers/CameraManager';
import ConnectionManager from './managers/ConnectionManager';
import ControlsManager from './managers/ControlsManager';
import DebugManager from './managers/DebugManager';
import RenderManager from './managers/RenderManager';
import ScaleManager from './managers/ScaleManager';
import { UiManager } from './managers/UiManager';
import GameScene from './scenes/GameScene';
import PlayerManager from './managers/PlayerManager';
import { Timer } from 'three/examples/jsm/misc/Timer.js';
import { run } from './quaternion-test';

if (process.env.DEBUG === 'true') {
	console.log('loaded esbuild watch listener');
	new EventSource('/esbuild').addEventListener('change', () =>
		location.reload()
	);
}
export default class App {
	public currentScene: GameScene;
	public renderer: RenderManager;
	public camera: CameraManager;
	public ui: UiManager;
	public timer: Timer;
	public debugger: DebugManager;
	public client: ConnectionManager;
	public overlay: HTMLElement;
	public controls: ControlsManager;
	public scale: ScaleManager;
	public playerManager: PlayerManager;
	private isPaused: boolean = false;
	readonly debug: boolean = false;

	constructor() {
		run();
		// this.debug = process.env.DEBUG === 'true';
		// this.timer = new Timer();
		// this.client = new ConnectionManager(this);
		// this.controls = new ControlsManager(this);
		// this.camera = new CameraManager(this);
		// this.renderer = new RenderManager(this);
		// this.currentScene = new GameScene(this);
		// this.scale = new ScaleManager(this);
		// this.ui = new UiManager(this);
		// this.playerManager = new PlayerManager(this);
		// this.renderer.setupRenderPasses();
		// // this.setupVisibilityChangeListener();
		// this.client.init();
		// requestAnimationFrame(this.animate.bind(this));
		// if (this.debug) this.debugger = new DebugManager(this);
	}

	private animate(timestamp: number) {
		this.timer.update(timestamp);
		const deltaMs = this.timer.getDelta() * 1000;

		this.camera.update();
		this.debugger?.update();
		if (this.currentScene) this.currentScene.update(deltaMs);
		if (this.debugger) this.debugger.stats.update();
		this.renderer.composer.render();
		requestAnimationFrame(this.animate.bind(this));
	}

	private setupVisibilityChangeListener() {
		// document.addEventListener('visibilitychange', () => {
		// 	if (document.hidden) {
		// 		this.isPaused = true;
		// 	} else {
		// 		this.isPaused = false;
		// 		this.timer.getDelta();
		// 		// if (this.playerManager.self) this.playerManager.localBuffer.empty();
		// 	}
		// });
	}
}

const game = new App();
