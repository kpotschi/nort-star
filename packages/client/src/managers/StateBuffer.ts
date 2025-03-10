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
			this[index].u - serverState.u,
			this[index].v - serverState.v,
			this[index].w - serverState.w
		);

		// The previous buffered state is the one just before the server timestamp
		this[index] = serverState;

		for (let i = index; i < this.length; i++) {
			const deltaMs = Number(this[i].timestamp) - Number(this[i - 1].timestamp);

			// rotation
			const rotation = new THREE.Euler(
				this[i - 1].u,
				this[i - 1].v,
				this[i - 1].w
			);
			const pos = new THREE.Vector3(
				this[i - 1].x,
				this[i - 1].y,
				this[i - 1].z
			);

			const direction = new THREE.Vector3(this[i - 1].dx, this[i - 1].dy, 0);

			updateRotation(deltaMs, direction, rotation);

			getForwardMovement(deltaMs, rotation, pos);

			this[i].u = rotation.x;
			this[i].v = rotation.y;
			this[i].w = rotation.z;

			this[i].x = pos.x;
			this[i].y = pos.y;
			this[i].z = pos.z;
		}
		// this.splice(0, index - 1);
	}

	public getLatestState(): PlayerState {
		return this[this.length - 1];
	}
	public getPreviousState(): PlayerState {
		return this[this.length - 2];
	}
}
