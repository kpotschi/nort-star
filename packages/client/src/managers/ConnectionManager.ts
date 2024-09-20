import { Player } from './../../../server/src/rooms/schema/MyRoomState';
import { Client, Room } from 'colyseus.js';
import App from '../app';
import { State } from '../../../server/src/rooms/schema/MyRoomState';
import { Spawn } from '../config/types';

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
				this.app.ui.setWarning('WAITING FOR OPPONENT...');
				this.room = room;
				this.app.currentScene.init();
				this.setUpStartListener();
			})
			.catch((error) => {
				this.app.ui.setWarning(error);
			});
	}

	private setUpStartListener() {
		this.room.onMessage('spawn', (spawn: Spawn) => {
			this.app.currentScene.spawnSelf(spawn);
		});

		this.room.onMessage('start', (message) => {
			this.app.currentScene.startGame();
		});
	}

	public setupPositionListener() {
		this.room.onStateChange((state: State) => {
			state.players.forEach((player: Player, key: string) => {
				if (this.room.sessionId !== key) {
					if (this.app.currentScene.opponentSpaceships[key]) {
						const opponent = this.app.currentScene.opponentSpaceships[key];

						opponent.position.set(player.x, player.y, player.z);
						opponent.quaternion.set(player.qx, player.qy, player.qz, player.qw);
					} else {
						this.app.currentScene.spawnOpponent(key, player);
					}
				}
			});
		});
	}
}
