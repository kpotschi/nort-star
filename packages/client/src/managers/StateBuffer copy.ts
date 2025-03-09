import { PlayerState } from '../../../server/src/rooms/schema/MyRoomState';
import * as THREE from 'three';
import Player from '../entities/Player';
import CONFIG from '../CONFIG_CLIENT';
import { getForwardMovement } from '../../../../shared/config/physics/movement';

export default class StateBuffer extends Array<PlayerState> {
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

	private enforceBufferSize() {
		if (this.length > this.maxBufferLength) {
			this.shift();
		}
	}

	public reconcile(serverState: PlayerState) {
		// Find the buffer state that corresponds to the server state time
		let index = this.findIndex((bufferState) => {
			return Number(bufferState.timestamp) > Number(serverState.timestamp);
		});

		// If we can't find a suitable state to reconcile with, exit
		if (index === -1 || index === 0) return;

		// The previous buffered state is the one just before the server timestamp
		const previousState = this[index - 1];

		// // Calculate position errors
		// const errorX = serverState.x - previousState.x;
		// const errorY = serverState.y - previousState.y;
		// const errorZ = serverState.z - previousState.z;

		// // Calculate quaternion errors (this is a simplification - for small errors only)
		// const errorQX = serverState.qx - previousState.qx;
		// const errorQY = serverState.qy - previousState.qy;
		// const errorQZ = serverState.qz - previousState.qz;
		// const errorQW = serverState.qw - previousState.qw;

		// Check if error is significant enough to reconcile
		// const positionErrorMagnitude = Math.sqrt(
		// 	errorX * errorX + errorY * errorY + errorZ * errorZ
		// );

		// const rotationErrorMagnitude = Math.sqrt(
		// 	errorQX * errorQX +
		// 		errorQY * errorQY +
		// 		errorQZ * errorQZ +
		// 		errorQW * errorQW
		// );

		// const POSITION_ERROR_THRESHOLD = 0.001; // Adjust based on your game scale
		// const ROTATION_ERROR_THRESHOLD = 0.001; // Adjust based on sensitivity needs

		// const needsPositionReconciliation =
		// 	positionErrorMagnitude > POSITION_ERROR_THRESHOLD;
		// const needsRotationReconciliation =
		// 	rotationErrorMagnitude > ROTATION_ERROR_THRESHOLD;

		// if (needsPositionReconciliation || needsRotationReconciliation) {
		// Apply corrections to all states after the reconciliation point
		for (let i = index - 1; i < this.length; i++) {
			// Apply position corrections
			// Apply rotation corrections
			// if (needsRotationReconciliation) {
			// this[i].qx += errorQX * CONFIG.RECONCILIATION.POSITION_LERP_FACTOR;
			// this[i].qy += errorQY * CONFIG.RECONCILIATION.POSITION_LERP_FACTOR;
			// this[i].qz += errorQZ * CONFIG.RECONCILIATION.POSITION_LERP_FACTOR;
			// this[i].qw += errorQW * CONFIG.RECONCILIATION.POSITION_LERP_FACTOR;
			// Normalize quaternion to ensure it remains valid
			// const length = Math.sqrt(
			// 	this[i].qx * this[i].qx +
			// 		this[i].qy * this[i].qy +
			// 		this[i].qz * this[i].qz +
			// 		this[i].qw * this[i].qw
			// );
			// if (length > 0) {
			// 	this[i].qx /= length;
			// 	this[i].qy /= length;
			// 	this[i].qz /= length;
			// 	this[i].qw /= length;
			// }
			// }
			// if (needsPositionReconciliation) {
			// this[i].x += errorX * CONFIG.RECONCILIATION.POSITION_LERP_FACTOR;
			// this[i].y += errorY * CONFIG.RECONCILIATION.POSITION_LERP_FACTOR;
			// this[i].z += errorZ * CONFIG.RECONCILIATION.POSITION_LERP_FACTOR;
			// }
			if (i === index - 1) {
				this[i].x = serverState.x;
				this[i].y = serverState.y;
				this[i].z = serverState.z;
			} else {
				const deltaMs =
					Number(this[i].timestamp) - Number(this[i - 1].timestamp);

				const quat = new THREE.Quaternion();
				quat.set(this[i].qx, this[i].qy, this[i].qz, this[i].qw);

				const forwardVector = new THREE.Vector3(0, 0, 1);
				const moveAmount = (1 * deltaMs) / 100;

				forwardVector.applyQuaternion(quat);

				forwardVector.normalize();

				forwardVector.multiplyScalar(moveAmount);

				this[i].x = THREE.MathUtils.lerp(
					this[i].x,
					this[i - 1].x + forwardVector.x,
					0.3
				);
				this[i].y = THREE.MathUtils.lerp(
					this[i].y,
					this[i - 1].y + forwardVector.y,
					0.3
				);
				this[i].z = THREE.MathUtils.lerp(
					this[i].z,
					this[i - 1].z + forwardVector.z,
					0.3
				);
				// this[i].x = THREE.MathUtils.lerp(this[i].x, serverState.x, 0.3);
				// this[i].y = THREE.MathUtils.lerp(this[i].y, serverState.y, 0.3);
				// this[i].z = THREE.MathUtils.lerp(this[i].z, serverState.z, 0.3);
			}

			// }
			// Keep a few older states for interpolation if needed
			// const statesToKeep = 3;
			// const statesToRemove = Math.max(0, index - 1 - statesToKeep);
			// if (statesToRemove > 0) {
			// 	this.splice(0, statesToRemove);
			// } else {
			// 	// Just remove one old state if we can't remove the full amount
			// 	if (this.length > this.maxBufferLength - 10) {
			// 		this.shift();
			// 	}
			// }
			// Debug output for significant corrections
			// if (this.player.isSelf && positionErrorMagnitude > 0.1) {
			// 	console.log(
			// 		`Large reconciliation: ${positionErrorMagnitude.toFixed(3)} units`
			// 	);
			// }
		}
	}

	public getLatestState(): PlayerState {
		return this[this.length - 1];
	}
}
