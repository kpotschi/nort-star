import { StateOutput } from '../../../server/src/rooms/schema/MyRoomState';
import * as THREE from 'three';

export default class StateBuffer {
	readonly buffer: StateOutput[];
	readonly maxBufferLength: number;
	constructor(maxBufferLength = 100) {
		this.buffer = []; // Holds the server states
		this.maxBufferLength = maxBufferLength;
	}

	add(state: StateOutput) {
		this.buffer.push(state);

		if (this.buffer.length > this.maxBufferLength) {
			this.buffer.shift();
		}
	}

	getInterpolatedState(currentTime: number) {
		// Find two states to interpolate between based on the current time
		if (this.buffer.length < 2) {
			return null; // Not enough states to interpolate
		}

		let latestState: StateOutput = null;
		let nextState: StateOutput = null;

		// Iterate through the buffer to find the right pair of states
		for (let i = 0; i < this.buffer.length - 1; i++) {
			if (
				this.buffer[i].timestamp <= currentTime &&
				this.buffer[i + 1].timestamp >= currentTime
			) {
				latestState = this.buffer[i];
				nextState = this.buffer[i + 1];
				break;
			}
		}

		if (latestState && nextState) {
			// Calculate the interpolation factor
			const factor =
				(currentTime - latestState.timestamp) /
				(nextState.timestamp - latestState.timestamp);

			// Interpolate position and rotation
			const { x, y, z } = latestState.position;
			const interpolatedPosition = new THREE.Vector3(x, y, z)
				.clone()
				.lerp(nextState.position, factor);

			const { qx, qy, qz, qw } = latestState.rotation;
			const { qx: nqx, qy: nqy, qz: nqz, qw: nqw } = nextState.rotation;
			const interpolatedRotation = new THREE.Quaternion(qx, qy, qz, qw)
				.clone()
				.slerp(new THREE.Quaternion(nqx, nqy, nqz, nqw), factor);

			return { position: interpolatedPosition, rotation: interpolatedRotation };
		}

		return null; // If unable to find suitable states
	}
}
