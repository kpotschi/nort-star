import { PlayerState } from '../../../server/src/rooms/schema/MyRoomState';
import * as THREE from 'three';
import { CONFIG } from '../config/config';
import Player from '../entities/Player';

export default class StateBuffer extends Array<PlayerState> {
	// readonly buffer: PlayerState[];
	private maxBufferLength: number;
	readonly player: Player;

	constructor(player: Player, initialState: PlayerState = new PlayerState()) {
		super();
		this.player = player;

		this.maxBufferLength = CONFIG.CLIENT_CONFIG.BUFFER_LENGTH;
		this.add(initialState);
	}

	public add(state: PlayerState) {
		this.push(state);

		this.enforceBufferSize();
	}

	// public addLatest(): StateBuffer {
	// 	const latestState = this.getCurrentState(this.player);
	// 	this.add(latestState);
	// 	this.enforceBufferSize();
	// 	return this;
	// }

	private enforceBufferSize() {
		if (this.length > this.maxBufferLength) {
			this.shift();
		}
	}

	public reconcile(serverState: PlayerState) {
		// Find the most recent buffered state that is before or at the server timestamp

		let index = this.findIndex((bufferState) => {
			return bufferState.timestamp > serverState.timestamp;
		});
		// // If there is no buffered state after the server's timestamp, there's nothing to reconcile
		if (index === -1 || index === 0) return;
		// // The previous buffered state is the one just before the server timestamp
		const previousState = this[index - 1];
		// // Calculate the error between the server's state and the predicted state
		const errorX = serverState.x - previousState.x;
		const errorY = serverState.y - previousState.y;
		const errorZ = serverState.z - previousState.z;

		for (let i = index - 1; i < this.length; i++) {
			this[i].x += errorX * CONFIG.SERVER_RECON.POSITION_LERP_FACTOR;
			this[i].y += errorY * CONFIG.SERVER_RECON.POSITION_LERP_FACTOR;
			this[i].z += errorZ * CONFIG.SERVER_RECON.POSITION_LERP_FACTOR;
		}
		this.splice(0, index - 1);
		// this.playerManager.self.spaceShip.updatePosition();
	}

	// public getCurrentState(player: Player): PlayerState {
	// 	const state = new PlayerState();
	// 	state.dx = player.velocity.x;
	// 	state.dy = player.velocity.y;
	// 	state.dz = player.velocity.z;
	// 	state.timestamp = Date.now().toString();
	// 	state.x = player.position.x;
	// 	state.y = player.position.y;
	// 	state.z = player.position.z;
	// 	return state;
	// }
	// getInterpolatedState(currentTime: number): THREE.Vector3Like {
	// 	// Find two states to interpolate between based on the current time
	// 	if (this.buffer.length < 2) {
	// 		return null; // Not enough states to interpolate
	// 	}

	// 	let previousState: PlayerState = null;
	// 	let nextState: PlayerState = null;

	// 	// Iterate through the buffer to find the right pair of states
	// 	for (let i = 0; i < this.buffer.length - 1; i++) {
	// 		if (
	// 			Number(this.buffer[i].timestamp) <= currentTime &&
	// 			Number(this.buffer[i + 1].timestamp) >= currentTime
	// 		) {
	// 			previousState = this.buffer[i];
	// 			nextState = this.buffer[i + 1];
	// 			break;
	// 		}
	// 	}

	// 	if (previousState && nextState) {
	// 		// Calculate the interpolation factor (0 to 1)
	// 		const factor =
	// 			(currentTime - Number(previousState.timestamp)) /
	// 			(Number(nextState.timestamp) - Number(previousState.timestamp));

	// 		// Interpolate x and y positions
	// 		const interpolatedX =
	// 			previousState.x + (nextState.x - previousState.x) * factor;
	// 		const interpolatedY =
	// 			previousState.y + (nextState.y - previousState.y) * factor;
	// 		const interpolatedZ =
	// 			previousState.z + (nextState.z - previousState.z) * factor;

	// 		return { x: interpolatedX, y: interpolatedY, z: interpolatedZ };
	// 	}

	// 	return null; // If unable to find suitable states
	// }
}
