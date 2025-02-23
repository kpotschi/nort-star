import * as THREE from 'three';
import CameraManager from './managers/CameraManager';
import ConnectionManager from './managers/ConnectionManager';
import ControlsManager from './managers/ControlsManager';
import {
	default as Debugger,
	default as DebugManager,
} from './managers/DebugManager';
import {
	default as CustomRenderer,
	default as RenderManager,
} from './managers/RenderManager';
import ScaleManager from './managers/ScaleManager';
import { UiManager } from './managers/UiManager';
import GameScene from './scenes/GameScene';
import PlayerManager from './managers/PlayerManager';
if (process.env.DEBUG === 'true') {
	console.log('loaded esbuild watch listener');
	new EventSource('/esbuild').addEventListener('change', () =>
		location.reload()
	);
}
export default class App {
	public currentScene: GameScene;
	public renderer: CustomRenderer;
	public camera: CameraManager;
	public ui: UiManager;
	public clock: THREE.Clock;
	public debugger: Debugger;
	public client: ConnectionManager;
	public overlay: HTMLElement;
	public controls: ControlsManager;
	public scale: ScaleManager;
	public playerManager: PlayerManager;
	private isPaused: boolean = false;

	constructor() {
		this.clock = new THREE.Clock();
		this.client = new ConnectionManager(this);
		this.camera = new CameraManager(this);
		this.renderer = new RenderManager(this);
		this.currentScene = new GameScene(this);
		this.scale = new ScaleManager(this);
		this.controls = new ControlsManager(this);
		this.ui = new UiManager(this);
		this.renderer.setupRenderPasses();
		this.debugger = new DebugManager(this);
		this.playerManager = new PlayerManager(this);
		this.setupVisibilityChangeListener();

		this.init();
		this.animate();
	}

	private init() {
		this.client.init();
	}

	private animate() {
		const deltaMs = this.clock.getDelta() * 1000;

		this.camera.update();
		if (this.currentScene) this.currentScene.update(deltaMs);
		if (this.debugger) this.debugger.stats.update();
		this.renderer.composer.render();
		requestAnimationFrame(this.animate.bind(this));
	}

	private setupVisibilityChangeListener() {
		document.addEventListener('visibilitychange', () => {
			if (document.hidden) {
				this.isPaused = true;
			} else {
				this.isPaused = false;
				this.clock.getDelta();
				// if (this.playerManager.self) this.playerManager.localBuffer.empty();
			}
		});
	}
}

const game = new App();
