import { Client, Room } from 'colyseus';
import * as THREE from 'three';
import { Spawn } from '../../../../shared/config/types.d';
import CONFIG from '../../CONFIG_SERVER';
import {
	getForwardMovement,
	updateRotation,
} from './../../../../shared/physics/movement';
import { PlayerState, State } from './schema/MyRoomState';
import * as fs from 'fs'; // Add this import

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

		this.onMessage(
			'move',
			(
				client,
				data: {
					previousState: PlayerState;
					currentState: PlayerState;
				}
			) => {
				const player = this.state.players.get(client.sessionId);
				const { previousState, currentState } = data;
				if (player) {
					// old states
					const rotation = new THREE.Euler(player.u, player.v, player.w);
					const direction = new THREE.Vector3(player.dx, player.dy, 0);
					const position = new THREE.Vector3(player.x, player.y, player.z);

					// split into previous and current buffer calculation

					// const deltaMsToPrevious =
					// 	Number(previousState.timestamp) - Number(player.timestamp);

					// updateRotation(deltaMsToPrevious, direction, rotation);

					// const deltaMsPreviousToCurrent =
					// 	Number(currentState.timestamp) - Number(previousState.timestamp);

					// direction.x = currentState.dx;
					// direction.y = currentState.dy;

					// updateRotation(deltaMsPreviousToCurrent, direction, rotation);

					const deltaMs =
						Number(currentState.timestamp) - Number(player.timestamp);

					// direction.x = currentState.dx;
					// direction.y = currentState.dy;

					updateRotation(deltaMs, direction, rotation);

					getForwardMovement(deltaMs, rotation, position);

					// Store the received direction from client
					player.dx = currentState.dx;
					player.dy = currentState.dy;

					// update rotation
					player.u = rotation.x;
					player.v = rotation.y;
					player.w = rotation.z;

					// Update position
					player.x = position.x;
					player.y = position.y;
					player.z = position.z;

					// Update timestamp
					player.timestamp = currentState.timestamp;
				}
			}
		);

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
		newPlayer.dy = 0;

		newPlayer.u = 0;
		newPlayer.v = 0;
		newPlayer.w = 0;

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
}
