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
		bufferState.speed = state.speed;

		bufferState.numericTimestamp = Number(state.timestamp);

		this.buffer.push(bufferState);

		if (this.buffer.length > this.maxBufferLength) {
			this.buffer.shift();
		}
	}
}
