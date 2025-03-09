import * as THREE from 'three';
import { updateRotation } from '../../../../shared/config/physics/movement';
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
			(bufferState) => bufferState.timestamp > serverState.timestamp
		);

		// If we can't find a suitable state to reconcile with, exit
		if (index === -1 || index === 0) return;

		// The previous buffered state is the one just before the server timestamp
		this[index - 1] = serverState;

		for (let i = index; i < this.length; i++) {
			const deltaMs = Number(this[i].timestamp) - Number(this[i - 1].timestamp);

			// rotation
			const quat = new THREE.Quaternion(
				this[i - 1].qx,
				this[i - 1].qy,
				this[i - 1].qz,
				this[i - 1].qw
			);

			updateRotation(deltaMs, this[i - 1].dx, this[i - 1].dz, quat);

			this[i].qw = quat.w;
			this[i].qx = quat.x;
			this[i].qy = quat.y;
			this[i].qz = quat.z;

			// position
			const forwardVector = new THREE.Vector3(0, 0, 1);
			const moveAmount = (1 * deltaMs) / 100;

			forwardVector.applyQuaternion(quat);

			forwardVector.normalize();

			forwardVector.multiplyScalar(moveAmount);

			this[i].x = this[i - 1].x + forwardVector.x;
			this[i].y = this[i - 1].y + forwardVector.y;
			this[i].z = this[i - 1].z + forwardVector.z;
		}
		this.splice(0, index - 1);
	}

	public getLatestState(): PlayerState {
		return this[this.length - 1];
	}
}
