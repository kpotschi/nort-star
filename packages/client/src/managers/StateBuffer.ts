import * as THREE from 'three';
import {
	getForwardMovement,
	updateRotation,
} from '../../../../shared/physics/movement';
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

		console.log(
			'x',
			this[index - 1].x,
			serverState.x,
			'y',
			this[index - 1].y,
			serverState.y,
			'z',
			this[index - 1].z,
			serverState.z,
			'qw',
			this[index - 1].qw,
			serverState.qw,
			'qx',
			this[index - 1].qx,
			serverState.qx,
			'qy',
			this[index - 1].qy,
			serverState.qy,
			'qz',
			this[index - 1].qz,
			serverState.qz,
			'timestamp',
			this[index - 1].timestamp,
			serverState.timestamp
		);
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
			const pos = new THREE.Vector3(
				this[i - 1].x,
				this[i - 1].y,
				this[i - 1].z
			);

			updateRotation(deltaMs, this[i - 1].dx, this[i - 1].dz, quat);

			getForwardMovement(deltaMs, quat, pos);

			// this[i].qw = quat.w;
			// this[i].qx = quat.x;
			// this[i].qy = quat.y;
			// this[i].qz = quat.z;

			this[i].x = pos.x;
			this[i].y = pos.y;
			this[i].z = pos.z;
		}
		this.splice(0, index - 1);
	}

	public getLatestState(): PlayerState {
		return this[this.length - 1];
	}
}
