import { MapSchema } from '@colyseus/schema';
import App from '../app';
import { Player, State } from '../../../server/src/rooms/schema/MyRoomState';
import { Room } from 'colyseus.js';
import Spaceship from '../entities/Spaceship';
import PlayerShip from '../entities/PlayerShip';

export default class PlayerManager {
	private app: App;
	private players: MapSchema<Player, string>;
	private room: Room<State>;
	public ownSpaceship: PlayerShip | null = null;
	public opponentSpaceships: { [id: string]: Spaceship } = {};

	constructor(app: App) {
		this.app = app;
	}

	public init() {
		this.room = this.app.currentScene.room;
		this.players = this.app.currentScene.room.state.players;
		this.setupPlayerListeners();
	}

	private setupPlayerListeners() {
		this.players.onAdd((player: Player, key: string) => {
			if (this.room.sessionId !== key) {
				this.spawnOpponent(key, player);
			} else {
				this.spawnSelf(player);
			}
		});

		this.players.onRemove((player: Player, key: string) => {
			if (this.opponentSpaceships[key]) {
				this.removeOpponent(key);
			}
		});

		this.room.onStateChange((state: State) => {
			state.players.forEach((player: Player, key: string) => {
				if (this.room.sessionId !== key && this.opponentSpaceships[key]) {
					const opponent = this.opponentSpaceships[key];
					opponent.serverPosition.x = player.x;
					opponent.serverPosition.y = player.y;
					opponent.serverPosition.z = player.z;
					opponent.serverQ.x = player.qx;
					opponent.serverQ.y = player.qy;
					opponent.serverQ.z = player.qz;
					opponent.serverQ.w = player.qw;

					// opponent.position.set(player.x, player.y, player.z);
					// opponent.quaternion.set(player.qx, player.qy, player.qz, player.qw);
				}
			});
		});
	}

	private spawnSelf(player: Player) {
		this.ownSpaceship = new PlayerShip(this.app.currentScene, player);
	}

	private spawnOpponent(key: string, player: Player) {
		const opponentSpaceship = new Spaceship(this.app.currentScene, player);
		this.opponentSpaceships[key] = opponentSpaceship;
		this.app.ui.addMessage(key + ' JOINED');
	}

	private removeOpponent(key: string) {
		if (this.opponentSpaceships[key]) {
			this.app.currentScene.remove(this.opponentSpaceships[key]);
			this.opponentSpaceships[key].geometry.dispose();
			// this.app.currentScene.opponentSpaceships[key].material.dispose();
			delete this.opponentSpaceships[key];
		}
		this.app.ui.addMessage(key + ' LEFT');
	}

	loop(delta: number) {
		if (this.ownSpaceship) {
			this.ownSpaceship.handleInput(delta);
		}

		for (const id in this.opponentSpaceships) {
			if (this.opponentSpaceships.hasOwnProperty(id)) {
				const spaceship = this.opponentSpaceships[id];
				spaceship.move(delta);
			}
		}
	}
}
