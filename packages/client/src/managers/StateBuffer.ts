import { PlayerState } from '../../../server/src/rooms/schema/MyRoomState';

export default class StateBuffer {
	readonly buffer: PlayerState[];
	readonly maxBufferLength: number;

	constructor(maxBufferLength = 100) {
		this.buffer = []; // Holds the server states
		this.maxBufferLength = maxBufferLength;
	}

	add(state: PlayerState) {
		// Add the new state to the buffer
		this.buffer.push(state);

		// Ensure the buffer does not exceed the maximum length
		if (this.buffer.length > this.maxBufferLength) {
			this.buffer.shift(); // Remove the oldest state if buffer is too long
		}
	}

	getInterpolatedState(currentTime: number) {
		// Find two states to interpolate between based on the current time
		if (this.buffer.length < 2) {
			return null; // Not enough states to interpolate
		}

		let previousState: PlayerState = null;
		let nextState: PlayerState = null;

		// Iterate through the buffer to find the right pair of states
		for (let i = 0; i < this.buffer.length - 1; i++) {
			if (
				Number(this.buffer[i].timestamp) <= currentTime &&
				Number(this.buffer[i + 1].timestamp) >= currentTime
			) {
				previousState = this.buffer[i];
				nextState = this.buffer[i + 1];
				break;
			}
		}

		if (previousState && nextState) {
			// Calculate the interpolation factor (0 to 1)
			const factor =
				(currentTime - Number(previousState.timestamp)) /
				(Number(nextState.timestamp) - Number(previousState.timestamp));

			// Interpolate x and y positions
			const interpolatedX =
				previousState.x + (nextState.x - previousState.x) * factor;
			const interpolatedY =
				previousState.y + (nextState.y - previousState.y) * factor;

			return { x: interpolatedX, y: interpolatedY };
		}

		return null; // If unable to find suitable states
	}
}
