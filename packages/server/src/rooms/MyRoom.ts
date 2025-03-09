import { Client, Room } from 'colyseus';
import * as THREE from 'three';
import { Spawn } from '../../../../shared/config/types.d';
import CONFIG from '../../CONFIG_SERVER';
import {
	getForwardMovement,
	updateRotation,
} from './../../../../shared/config/physics/movement';
import { PlayerState, State } from './schema/MyRoomState';

interface MyUserData {
	username: string;
	score: number;
}

export class GameRoom extends Room<State> {
	readonly maxClients = 2;
	readonly spawnPositions: Spawn[] = [
		{ x: 0, y: 0, z: -2 },
		{ x: 0, y: 0, z: 2 },
	];
	readonly tickRate = 10;
	state = new State();

	onCreate() {
		console.log('creating room ', this.roomId);

		this.onMessage('move', (client, data: PlayerState) => {
			const player = this.state.players.get(client.sessionId);

			if (player) {
				const deltaMs = Number(data.timestamp) - Number(player.timestamp);

				// Store the received direction from client
				player.dx = data.dx;
				player.dz = data.dz;

				const currentQuat = new THREE.Quaternion(
					player.qx,
					player.qy,
					player.qz,
					player.qw
				);

				updateRotation(deltaMs, data.dx, data.dz, currentQuat);

				// update rotation
				player.qw = currentQuat.w;
				player.qx = currentQuat.x;
				player.qy = currentQuat.y;
				player.qz = currentQuat.z;

				const forwardVector = getForwardMovement(
					deltaMs,
					currentQuat,
					CONFIG.GAMEPLAY.START_SPEED
				);

				// Update position
				player.x += forwardVector.x;
				player.y += forwardVector.y;
				player.z += forwardVector.z;

				// Update timestamp
				player.timestamp = data.timestamp;
			}
		});

		// Server-side game loop
		// this.setSimulationInterval(
		// 	(delta) => this.updateLoop(delta),
		// 	1000 / this.tickRate
		// );
	}

	onJoin(client: Client, options: any) {
		this.handleJoin(client);
	}

	private handleJoin(client: Client<MyUserData, any>) {
		const clientIndex = this.clients.length - 1;
		const spawnPosition = this.spawnPositions[clientIndex];

		const newPlayer = new PlayerState();
		newPlayer.x = spawnPosition.x;
		newPlayer.y = spawnPosition.y;
		newPlayer.z = spawnPosition.z;
		newPlayer.dx = 0;
		newPlayer.dz = 0;

		// Initialize quaternion to identity (no rotation)
		newPlayer.qw = 1;
		newPlayer.qx = 0;
		newPlayer.qy = 0;
		newPlayer.qz = 0;

		newPlayer.timestamp = Date.now();

		newPlayer.color =
			CONFIG.SPAWN_COLORS[clientIndex % CONFIG.SPAWN_COLORS.length];

		this.state.players.set(client.sessionId, newPlayer);
		console.log(client.sessionId, ' joined with color ', newPlayer.color);
	}

	onLeave(client: Client, consented: boolean) {
		console.log(client.sessionId + ' left');
		this.state.players.delete(client.sessionId);
	}

	private updateLoop(deltaMs: number) {
		this.state.players.forEach((player: PlayerState) => {
			// You can add additional server-side updates here if needed
			// For example, collision detection or game mechanics
		});
	}
}
