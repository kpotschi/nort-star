import * as THREE from 'three';
import CustomRenderer from './entities/CustomRenderer';
import Debugger from './entities/Debugger';
import GameScene from './scenes/GameScene';
import CustomCamera from './entities/CustomCamera';
import { Client, Room } from 'colyseus.js';
import { State } from '../../server/src/rooms/schema/MyRoomState';
import { UiManager } from './entities/UiManager';
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
	public ui: UiManager;
	public clock: THREE.Clock;
	public debugger: Debugger;
	public keysPressed: {} = {};
	private client: Client;
	public room: Room;
	public overlay: HTMLElement;

	constructor() {
		this.clock = new THREE.Clock();
		this.init();
	}

	private async init() {
		this.client = new Client('http://localhost:2567');
		this.camera = new CustomCamera(this);
		this.renderer = new CustomRenderer(this);
		this.currentScene = new GameScene(this);
		this.setupResizeListener();
		this.createControls();
		this.ui = new UiManager(this);
		await this.client
			.joinOrCreate<State>('my_room')
			.then((room: Room<State>) => {
				room.state.players.onAdd((player, sessionId) => {
					console.log('Player added!', player, sessionId);
				});

				this.overlay.innerText = 'WAITING FOR OPPONENT...';
				this.room = room;
				this.currentScene.init();
				this.setUpStartListener();
			})
			.catch((error) => {
				this.overlay.innerText = error;
			});
		this.renderer.setupRenderPasses();
		this.renderer.setAnimationLoop(this.loop.bind(this));
		this.setupDebugger();
	}

	private setUpStartListener() {
		this.room.onMessage('start', (message) => {
			console.log(message.message); // "Game is starting!"
			this.currentScene.startGame();
		});
	}

	private addText() {
		this.overlay = document.createElement('div');
		this.overlay.innerText = 'JOINING ROOM..';
		this.overlay.id = 'overlay';
		document.body.append(this.overlay);
	}

	private createControls() {
		window.addEventListener('keydown', (event) => {
			this.keysPressed[event.key.toLowerCase()] = true;
		});
		window.addEventListener('keyup', (event) => {
			this.keysPressed[event.key.toLowerCase()] = false;
		});
	}

	private loop() {
		const delta = this.clock.getDelta();
		this.camera.update();
		if (this.currentScene) this.currentScene.loop(delta);
		if (this.debugger) this.debugger.stats.update();
		this.renderer.composer.render();
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
