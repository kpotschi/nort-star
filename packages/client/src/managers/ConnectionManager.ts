import { Client, Room } from 'colyseus.js';
import { State } from '../../../server/src/rooms/schema/MyRoomState';
import App from '../app';

export default class ConnectionManager extends Client {
	private app: App;
	public room: Room<State>;
	constructor(app: App) {
		super('http://localhost:2567');
		this.app = app;
	}

	public async init() {
		await this.joinOrCreate<State>('my_room')
			.then((room: Room<State>) => {
				this.app.ui.addMessage('WAITING FOR OPPONENT...');
				this.room = room;
				this.app.currentScene.init();
				this.app.currentScene.startGame();
				this.app.playerManager.init();
			})
			.catch((error) => {
				this.app.ui.addMessage(error);
			});
	}
}
