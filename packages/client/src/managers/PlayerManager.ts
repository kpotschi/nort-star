import { MapSchema } from '@colyseus/schema';
import { getStateCallbacks, Room } from 'colyseus.js';
import {
	PlayerState,
	State,
} from './../../../../packages/server/src/rooms/schema/MyRoomState';

import App from '../app';
import { CONFIG } from '../config/config';
import Player from '../entities/Player';
import LocalBuffer from './LocalBuffer';
export default class PlayerManager {
	readonly app: App;
	private playerStates: MapSchema<PlayerState, string>;
	private players: Record<string, Player> = {};
	private room: Room<State>;
	private playerKeys: string[] = [];
	public self: Player;
	public localBuffer: LocalBuffer;
	readonly sendRate: number = CONFIG.SERVER_RECON.HEARTBEAT_MS;
	private lastHeartBeatTime: number = 0;
	private lastChange: number = Date.now();

	constructor(app: App) {
		this.app = app;
	}

	public init() {
		this.localBuffer = new LocalBuffer(this);
		this.room = this.app.currentScene.room;

		// this.playerStates = this.app.currentScene.room.state.players;
		this.setupPlayerListeners();
	}

	private setupPlayerListeners() {
		const $ = getStateCallbacks(this.room);

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
				$(playerState).onChange(() => {
					if (this.isSelf(key)) this.localBuffer.reconcile(playerState);
					if (this.isOpponent(key)) this.players[key].updateBasedOnServer();
				});
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

		// this.room.onStateChange((state: State) => {
		// 	console.log(Date.now() - this.lastChange);

		// 	this.lastChange = Date.now();
		// state.players.forEach((playerState: PlayerState, key: string) => {
		// 	if (this.isSelf(key)) this.localBuffer.reconcile(playerState);
		// 	if (this.isOpponent(key)) this.players[key].updateBasedOnServer();
		// });
		// });
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
		this.updateHeartBeat();
	}

	public sendServerUpdate() {
		const latestState = this.localBuffer?.getLatestState();

		if (latestState) {
			latestState.dx = this.self.velocity.x;
			latestState.dy = this.self.velocity.y;
			latestState.dz = 1;
			this.room.send<PlayerState>('move', latestState);
		}
	}

	public updateState(deltaMs: number): void {
		const state = new PlayerState();
		state.dx = this.self.velocity.x;
		state.dy = this.self.velocity.y;
		state.dz = this.self.velocity.z; // Ensure dz is included

		state.timestamp = Date.now().toString();

		const { x, y, z } = this.self.predictPosition(deltaMs);
		state.x = x;
		state.y = y;
		state.z = z;

		this.localBuffer.add(state);
	}

	public updateInput() {
		this.self.velocity.set(0, 0, 1);

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
			this.sendServerUpdate();

			this.lastHeartBeatTime = currentTime; // Update last send time
		}
	}

	public forcePositionToServerState() {
		const latestState = this.localBuffer.getLatestState();
		if (latestState) {
			this.self.spaceShip.position.set(
				latestState.x,
				latestState.y,
				latestState.z
			);
		}
	}
}
