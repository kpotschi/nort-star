import { MapSchema } from '@colyseus/schema';
import App from '../app';
import {
	PlayerState,
	State,
} from '../../../server/src/rooms/schema/MyRoomState';
import { Room } from 'colyseus.js';
import Spaceship from '../entities/Spaceship';
import LocalBuffer from './LocalBuffer';
import Player from '../entities/Player';

export default class PlayerManager {
	readonly app: App;
	private playerStates: MapSchema<PlayerState, string>;
	private players: Record<string, Player> = {};
	private room: Room<State>;
	public self: Player;
	public localBuffer: LocalBuffer;

	constructor(app: App) {
		this.app = app;
	}

	public init() {
		this.localBuffer = new LocalBuffer();
		this.room = this.app.currentScene.room;
		this.playerStates = this.app.currentScene.room.state.players;
		this.setupPlayerListeners();
	}

	private setupPlayerListeners() {
		this.playerStates.onAdd((playerState: PlayerState, key: string) => {
			const isSelf = this.room.sessionId === key;
			this.players[key] = new Player(this.app, playerState, isSelf);
			if (isSelf) this.self = this.players[key];
		});

		this.playerStates.onRemove((playerState: PlayerState, key: string) => {
			if (this.players[key]) this.remove(key);
		});

		// this.room.onStateChange((state: State) => {
		// 	state.players.forEach((playerState: PlayerState, key: string) => {
		// 		if (this.opponentSpaceships[key]) {
		// 			const ship = this.opponentSpaceships[key];
		// 			ship.stateBuffer.add(playerState);
		// 		} else if (this.room.sessionId === key) {
		// 			this.ownSpaceship.stateBuffer.add(playerState);
		// 		}
		// 	});
		// });
	}

	private remove(key: string) {
		const ship = this.players[key].spaceShip;
		this.app.currentScene.remove(ship);
		ship.geometry.dispose();
		// ship.material.dispose();
		delete this.players[key];
		this.app.ui.addMessage(key + ' LEFT');
	}

	public update(delta: number) {
		const playerKeys = Object.keys(this.players);
		for (let i = 0; i < playerKeys.length; i++) {
			this.players[playerKeys[i]].update(delta);
		}
	}

	// loop(delta: number) {
	// 	if (this.ownSpaceship) {
	// 		this.ownSpaceship.handleInput(delta);
	// 		this.ownSpaceship.move(delta);
	// 	}

	// 	for (const id in this.opponentSpaceships) {
	// 		if (this.opponentSpaceships.hasOwnProperty(id)) {
	// 			const spaceship = this.opponentSpaceships[id];
	// 			spaceship.move(delta);
	// 		}
	// 	}
	// }
}
