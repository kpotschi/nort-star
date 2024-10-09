import {
	LocalBufferPlayerState,
	PlayerState,
} from '../../../server/src/rooms/schema/MyRoomState';

export default class LocalBuffer {
	readonly buffer: LocalBufferPlayerState[];
	readonly maxBufferLength: number;
	constructor(maxBufferLength = 100) {
		this.buffer = [];
		this.maxBufferLength = maxBufferLength;
	}

	public add(state: PlayerState) {
		const bufferState = new LocalBufferPlayerState();

		bufferState.x = state.x;
		bufferState.y = state.y;
		bufferState.dx = state.dx;
		bufferState.dy = state.dy;

		bufferState.numericTimestamp = Number(state.timestamp);

		this.buffer.push(bufferState);

		if (this.buffer.length > this.maxBufferLength) {
			this.buffer.shift();
		}
	}

	reconcile(state: PlayerState) {
		// Find the most recent buffered state that is before or at the server timestamp
		let index = this.buffer.findIndex(
			(bufferState) => bufferState.numericTimestamp > Number(state.timestamp)
		);

		// If there is no buffered state after the server's timestamp, there's nothing to reconcile
		if (index === -1) return;

		// The previous buffered state is the one just before the server timestamp
		const previousState = this.buffer[index - 1];

		// Calculate the error between the server's state and the predicted state
		const errorX = state.x - previousState.x;
		const errorY = state.y - previousState.y;

		const lerpFactor = 0.1; // Adjust this factor to control the smoothing

		// Apply the correction using lerp to the previous state and all subsequent states in the buffer
		for (let i = index - 1; i < this.buffer.length; i++) {
			this.buffer[i].x += errorX * lerpFactor;
			this.buffer[i].y += errorY * lerpFactor;
		}

		this.buffer.splice(0, index - 1);
		// Optionally, you can apply some smoothing factor here to avoid sudden snapping
		// For example, you can lerp between the current position and the corrected position.
	}

	public isEmpty(): boolean {
		return this.buffer.length === 0;
	}
}
