import { StateInput } from '../../../server/src/rooms/schema/MyRoomState';

export default class LocalBuffer {
	readonly buffer: StateInput[];
	readonly maxBufferLength: number;
	constructor(maxBufferLength = 100) {
		this.buffer = [];
		this.maxBufferLength = maxBufferLength;
	}

	public add(state: StateInput) {
		this.buffer.push(state);
		if (this.buffer.length > this.maxBufferLength) {
			this.buffer.shift();
		}
	}
}
