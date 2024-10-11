import { CONFIG } from './../../../../node_modules/nort-star-client/src/config/config';
import {
	LocalBufferPlayerState,
	PlayerState,
} from '../../../server/src/rooms/schema/MyRoomState';
import GameScene from '../scenes/GameScene';
import PlayerManager from './PlayerManager';

export default class LocalBuffer {
	readonly buffer: LocalBufferPlayerState[];
	readonly maxBufferLength: number;
	private playerManager: PlayerManager;

	constructor(playerManager: PlayerManager, maxBufferLength = 100) {
		this.playerManager = playerManager;
		this.buffer = [];
		this.maxBufferLength = maxBufferLength;
	}

	public add(state: PlayerState) {
		const bufferState = new LocalBufferPlayerState();

		bufferState.x = state.x;
		bufferState.y = state.y;
		bufferState.dx = state.dx;
		bufferState.dy = state.dy;

		bufferState.timestamp = Number(state.timestamp);

		this.buffer.push(bufferState);

		if (this.buffer.length > this.maxBufferLength) {
			this.buffer.shift();
		}
	}

	reconcile(state: PlayerState) {
		// Find the most recent buffered state that is before or at the server timestamp
		let index = this.buffer.findIndex(
			(bufferState) => bufferState.timestamp > Number(state.timestamp)
		);

		// If there is no buffered state after the server's timestamp, there's nothing to reconcile
		if (index === -1 || index === 0) return;

		// The previous buffered state is the one just before the server timestamp
		const previousState = this.buffer[index - 1];

		// Calculate the error between the server's state and the predicted state
		const errorX = state.x - previousState.x;
		const errorY = state.y - previousState.y;

		for (let i = index - 1; i < this.buffer.length; i++) {
			this.buffer[i].x += errorX * CONFIG.SERVER_RECON.POSITION_LERP_FACTOR;
			this.buffer[i].y += errorY * CONFIG.SERVER_RECON.POSITION_LERP_FACTOR;
		}

		this.buffer.splice(0, index - 1);

		this.playerManager.self.spaceShip.updatePosition();
	}

	public isEmpty(): boolean {
		return this.buffer.length === 0;
	}

	public getLatestState(): PlayerState {
		const localState = this.buffer[this.buffer.length - 1];
		const playerState = new PlayerState();
		// Create a shallow copy of the state
		playerState.dx = localState.dx;
		playerState.dy = localState.dy;

		playerState.x = localState.x;
		playerState.y = localState.y;
		playerState.timestamp = localState.timestamp.toString();

		// Convert the timestamp to a string

		return playerState;
	}
}
