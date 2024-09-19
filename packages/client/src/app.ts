import { MyRoomState } from './../../server/src/rooms/schema/MyRoomState';
import * as THREE from 'three';
import CustomRenderer from './entities/CustomRenderer';
import Debugger from './entities/Debugger';
import GameScene from './scenes/GameScene';
import CustomCamera from './entities/CustomCamera';
import { Client, Room } from 'colyseus.js';

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
	private client: Client;
	private room: Room;
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
		this.addText();
		await this.client
			.joinOrCreate<MyRoomState>('my_room')
			.then((room: Room<MyRoomState>) => {
				this.overlay.innerText = 'WAITING FOR OPPONENT...';
				this.room = room;
			})
			.catch((error) => {
				this.overlay.innerText = error;
			});
		this.renderer.setupRenderPasses();
		this.renderer.setAnimationLoop(this.loop.bind(this));
		this.setupDebugger();
		this.currentScene.init();
		// room.state.players.onAdd((player, sessionId) => {
		// 	console.log('Player added!', player, sessionId);
		// 	// on player "position" change
		// 	player.listen('position', (position, previousPosition) => {
		// 		console.log('player position changed!', { position, previousPosition });
		// 	});
		// });
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
