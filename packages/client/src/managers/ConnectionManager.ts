import { bool } from './../../../../node_modules/@types/three/src/Three.TSL.d';
import { Client, Room } from 'colyseus.js';
import {
	PlayerState,
	State,
} from '../../../server/src/rooms/schema/MyRoomState';
import App from '../app';
import CONFIG from '../CONFIG_CLIENT';

export default class ConnectionManager extends Client {
	readonly app: App;
	public room: Room<State>;
	public listenToServerUpdates: boolean = true;
	readonly sendRate: number = CONFIG.RECONCILIATION.HEARTBEAT_MS;
	private lastHeartBeatTime: number = 0;

	constructor(app: App) {
		super('http://192.168.178.29:2567');
		this.app = app;
	}

	public async init() {
		await this.joinOrCreate<State>('my_room')
			.then((room: Room<State>) => {
				this.app.ui.addMessage('WAITING FOR OPPONENT...');
				this.room = room;
				this.app.currentScene.init();
				this.app.playerManager.init();
			})
			.catch((error) => {
				this.app.ui.addMessage(error);
			});
	}

	public update() {
		this.updateHeartBeat();
	}

	private updateHeartBeat() {
		const currentTime = Date.now();

		if (currentTime - this.lastHeartBeatTime > this.sendRate) {
			this.sendServerUpdate();

			this.lastHeartBeatTime = currentTime; // Update last send time
		}
	}

	public sendServerUpdate() {
		const currentState = this.app?.playerManager?.self?.getCurrentState();

		if (currentState) this.room?.send<PlayerState>('move', currentState);
	}
}
