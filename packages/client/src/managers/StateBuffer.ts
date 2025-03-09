import * as THREE from 'three';
import {
	getForwardMovement,
	updateRotation,
} from '../../../../shared/config/physics/movement';
import { PlayerState } from '../../../server/src/rooms/schema/MyRoomState';
import CONFIG from '../CONFIG_CLIENT';
import Player from '../entities/Player';

export default class StateBuffer extends Array<PlayerState> {
	private maxBufferLength: number;
	readonly player: Player;

	constructor(player: Player) {
		super();
		this.player = player;

		this.maxBufferLength = CONFIG.CLIENT_CONFIG.BUFFER_LENGTH;
		// this.add(initialState);
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

	public reconcile(serverState: PlayerState) {
		// Find the buffer state that corresponds to the server state time
		let index = this.findIndex(
			(bufferState) =>
				Number(bufferState.timestamp) > Number(serverState.timestamp)
		);

		// If we can't find a suitable state to reconcile with, exit
		if (index === -1 || index === 0) return;

		// For debugging: check if the timestamp matches exactly
		const exactMatch = this[index - 1].timestamp === serverState.timestamp;

		// Get the client prediction for this timestamp
		const clientPrediction = this[index - 1];

		// Calculate position error
		const positionError = {
			x: serverState.x - clientPrediction.x,
			y: serverState.y - clientPrediction.y,
			z: serverState.z - clientPrediction.z,
		};

		const errorMagnitude = Math.sqrt(
			positionError.x * positionError.x +
				positionError.y * positionError.y +
				positionError.z * positionError.z
		);

		// Log significant errors (helps with debugging)
		if (errorMagnitude > 0.1) {
			console.log(`Position error: ${errorMagnitude.toFixed(3)} units`);
		}

		// Blend server and client states rather than completely replacing
		// This preserves any client data not sent by the server
		let state = new PlayerState();
		state = {
			...this[index - 1], // Keep client-side data
			x: serverState.x, // Update position from server
			y: serverState.y,
			z: serverState.z,
			qx: serverState.qx, // Update rotation from server
			qy: serverState.qy,
			qz: serverState.qz,
			qw: serverState.qw,
			timestamp: serverState.timestamp,
		};

		this[index - 1] = state;
		console.log(state);

		// Store the dx/dz values that were used during each buffered state
		const originalInputs = this.map((state) => ({
			dx: state.dx,
			dz: state.dz,
			timestamp: state.timestamp,
		}));

		// Recalculate future states based on the server-corrected state
		for (let i = index; i < this.length; i++) {
			const deltaMs = Number(this[i].timestamp) - Number(this[i - 1].timestamp);

			// Create quaternion from previous state
			const quat = new THREE.Quaternion(
				this[i - 1].qx,
				this[i - 1].qy,
				this[i - 1].qz,
				this[i - 1].qw
			);

			// Use the original inputs for this timestamp
			const originalInput = originalInputs.find(
				(input) => input.timestamp === this[i - 1].timestamp
			);

			const dx = originalInput ? originalInput.dx : this[i - 1].dx;
			const dz = originalInput ? originalInput.dz : this[i - 1].dz;

			// Apply rotation using shared logic
			updateRotation(deltaMs, dx, dz, quat);

			// Update rotation
			this[i].qw = quat.w;
			this[i].qx = quat.x;
			this[i].qy = quat.y;
			this[i].qz = quat.z;

			// Use shared movement logic for consistency
			const forwardVector = getForwardMovement(
				deltaMs,
				quat,
				CONFIG.GAMEPLAY.START_SPEED
			);

			// Update position
			this[i].x = this[i - 1].x + forwardVector.x;
			this[i].y = this[i - 1].y + forwardVector.y;
			this[i].z = this[i - 1].z + forwardVector.z;

			// Restore the original input directions
			if (originalInput) {
				this[i].dx = originalInput.dx;
				this[i].dz = originalInput.dz;
			}
		}

		// Remove older states after reconciliation completes
		// (outside the loop to avoid modifying while iterating)
		this.splice(0, index - 1);
	}

	public getLatestState(): PlayerState {
		return this[this.length - 1];
	}
}
