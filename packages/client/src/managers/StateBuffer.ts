import { PlayerState } from '../../../server/src/rooms/schema/MyRoomState';
import * as THREE from 'three';
import { CONFIG } from '../config/config';

export default class StateBuffer extends Array<PlayerState> {
	// readonly buffer: PlayerState[];
	private maxBufferLength: number;

	constructor(initialState: PlayerState = new PlayerState()) {
		super(CONFIG.CLIENT_CONFIG.BUFFER_LENGTH);
		this.maxBufferLength = CONFIG.CLIENT_CONFIG.BUFFER_LENGTH;
		this.add(initialState);
	}

	public add(state: PlayerState) {
		this.push(state);
		this.enforceBufferSize();
	}

	private enforceBufferSize() {
		if (this.length > this.maxBufferLength) {
			this.shift();
		}
	}
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
