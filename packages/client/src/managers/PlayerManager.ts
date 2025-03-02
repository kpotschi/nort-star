import { MapSchema } from '@colyseus/schema';
import { getStateCallbacks, Room } from 'colyseus.js';
import {
	PlayerState,
	State,
} from './../../../../packages/server/src/rooms/schema/MyRoomState';
import * as THREE from 'three';
import App from '../app';
import Player from '../entities/Player';

export default class PlayerManager {
	readonly app: App;
	private playerStates: MapSchema<PlayerState, string>;
	private players: Record<string, Player> = {};
	private room: Room<State>;
	private playerKeys: string[] = [];
	public self: Player;
	// public localBuffer: LocalBuffer;

	constructor(app: App) {
		this.app = app;
	}

	public init() {
		// this.localBuffer = new LocalBuffer(this);
		this.room = this.app.currentScene.room;

		// this.playerStates = this.app.currentScene.room.state.players;
		this.setupPlayerListeners();
	}

	private setupPlayerListeners() {
		const $ = getStateCallbacks(this.room as any);

		$(this.room.state).players.onAdd(
			(playerState: PlayerState, key: string) => {
				const isSelf = this.room.sessionId === key;

				this.players[key] = new Player(this.app, playerState, this, isSelf);
				this.playerKeys = Object.keys(this.players);
				if (isSelf) {
					this.app.ui.addMessage('OWN ID: ' + key);
					this.self = this.players[key];
				} else {
					this.app.ui.addMessage(key + ' JOINED');
				}
			}
		);

		$(this.room.state).players.onRemove(
			(playerState: PlayerState, key: string) => {
				if (this.players[key]) {
					this.remove(key);
					this.playerKeys = Object.keys(this.players);
				}
			}
		);

		this.room.onStateChange((state: State) => {
			state.players.forEach((serverState: PlayerState, key: string) => {
				const player = this.players[key];
				if (player && this.app.client.listenToServerUpdates) {
					player.latestServerState.state = serverState;
					player.latestServerState.wasConsumed = false;
				}
			});
		});
	}

	public isSelf(key: string): boolean {
		return this.room.sessionId === key;
	}

	public isOpponent(key: string): boolean {
		return this.room.sessionId !== key;
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
		for (const element of this.playerKeys) {
			this.players[element].update(deltaMs);
		}
	}
}
