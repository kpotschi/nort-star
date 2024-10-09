import { MapSchema } from '@colyseus/schema';
import { Room } from 'colyseus.js';
import {
	PlayerState,
	State,
} from '../../../server/src/rooms/schema/MyRoomState';
import App from '../app';
import Player from '../entities/Player';
import LocalBuffer from './LocalBuffer';
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
			this.players[key] = new Player(this.app, playerState, this, isSelf);
			if (isSelf) this.self = this.players[key];

			this.self.state.onChange(() => {
				// this.self.spaceShip.position.set(
			});
		});

		this.playerStates.onRemove((playerState: PlayerState, key: string) => {
			if (this.players[key]) this.remove(key);
		});

		this.room.onStateChange((state: State) => {
			state.players.forEach((playerState: PlayerState, key: string) => {
				if (this.isSelf(key)) this.localBuffer.reconcile(playerState);
			});
		});
	}

	public isSelf(key: string): boolean {
		return this.room.sessionId === key;
	}

	private remove(key: string) {
		const ship = this.players[key].spaceShip;
		this.app.currentScene.remove(ship);
		ship.geometry.dispose();
		// ship.material.dispose();
		delete this.players[key];
		this.app.ui.addMessage(key + ' LEFT');
	}

	public update(deltaMs: number) {
		const playerKeys = Object.keys(this.players);
		for (const element of playerKeys) {
			this.players[element].update(deltaMs);
		}
	}
}
