import { CONFIG } from './../../../../node_modules/nort-star-client/src/config/config';
import {
	PlayerState,
	State,
} from './../../../../packages/server/src/rooms/schema/MyRoomState';
import { MapSchema } from '@colyseus/schema';
import { Room } from 'colyseus.js';

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
	readonly sendRate: number = CONFIG.SERVER_RECON.HEARTBEAT_MS;
	private lastHeartBeatTime: number = 0;
	constructor(app: App) {
		this.app = app;
	}

	public init() {
		this.localBuffer = new LocalBuffer(this);
		this.room = this.app.currentScene.room;
		this.playerStates = this.app.currentScene.room.state.players;
		this.setupPlayerListeners();
	}

	private setupPlayerListeners() {
		this.playerStates.onAdd((playerState: PlayerState, key: string) => {
			const isSelf = this.room.sessionId === key;
			this.players[key] = new Player(this.app, playerState, this, isSelf);
			if (isSelf) this.self = this.players[key];
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
		this.updateHeartBeat();
	}

	public sendServerUpdate() {
		const latestState = this.localBuffer?.getLatestState();

		if (latestState) {
			latestState.dx = this.self.velocity.x;
			latestState.dy = this.self.velocity.y;

			this.room.send<PlayerState>('move', latestState);
		}
	}

	public updateState(deltaMs: number): void {
		const state = new PlayerState();
		state.dx = this.self.velocity.x;
		state.dy = this.self.velocity.y;
		state.timestamp = Date.now().toString();

		const { x, y } = this.self.predictPosition(deltaMs);
		state.x = x;
		state.y = y;

		this.localBuffer.add(state);
	}

	public updateInput() {
		this.self.velocity = { x: 0, y: 0 };

		if (this.app.controls.keysPressed['w']) {
			this.self.velocity.y += 1; // Forward
		}
		if (this.app.controls.keysPressed['s']) {
			this.self.velocity.y -= 1; // Backward
		}
		if (this.app.controls.keysPressed['d']) {
			this.self.velocity.x -= 1; // Left
		}
		if (this.app.controls.keysPressed['a']) {
			this.self.velocity.x += 1; // Right
		}

		// Normalize to prevent faster diagonal movement
		const length = Math.sqrt(
			this.self.velocity.x * this.self.velocity.x +
				this.self.velocity.y * this.self.velocity.y
		);
		if (length > 0) {
			this.self.velocity.x /= length;
			this.self.velocity.y /= length;
		}

		this.sendServerUpdate();
	}

	private updateHeartBeat() {
		const currentTime = Date.now();

		if (currentTime - this.lastHeartBeatTime > this.sendRate) {
			console.log('badumm');

			this.sendServerUpdate();

			this.lastHeartBeatTime = currentTime; // Update last send time
		}
	}
}
