import { CONFIG } from './../../../client/src/config/config';
import { Spawn } from './../../../client/src/config/types.d';
import { Client, Room } from 'colyseus';
import { PlayerState, State } from './schema/MyRoomState';
import { Quaternion, Vector3 } from 'three'; // Import Vector3 as well

export class GameRoom extends Room<State> {
	readonly maxClients = 2;
	readonly spawnPositions: Spawn[] = [
		{ x: 0, y: 0, z: -100 },
		{ x: 0, y: 0, z: 100 },
	];
	readonly tickRate = 10;
	state = new State();

	onCreate() {
		console.log('creating room ', this.roomId);

		this.onMessage('move', (client, data: PlayerState) => {
			const player = this.state.players.get(client.sessionId);

			const deltaMs = Number(data.timestamp) - Number(player.timestamp);
			const deltaSeconds = deltaMs / 1000;

			if (player) {
				// Update quaternion from client data
				player.qw = data.qw;
				player.qx = data.qx;
				player.qy = data.qy;
				player.qz = data.qz;

				// Update input values
				player.dx = Math.max(-1, Math.min(1, data.dx || 0));
				player.dy = Math.max(-1, Math.min(1, data.dy || 0));

				// Create quaternion from player data
				const playerQuat = new Quaternion(
					player.qx, // Note: THREE.js constructor is x,y,z,w order
					player.qy,
					player.qz,
					player.qw
				);

				// Calculate forward direction (Z-axis)
				const forwardVector = new Vector3(0, 0, 1);

				// Apply quaternion to the forward vector
				// In THREE.js, you use applyQuaternion to rotate a vector
				forwardVector.applyQuaternion(playerQuat);

				forwardVector.normalize();

				// Apply forward movement
				const moveAmount = (CONFIG.GAMEPLAY.START_SPEED * deltaMs) / 100;
				player.x += forwardVector.x * moveAmount;
				player.y += forwardVector.y * moveAmount;
				player.z += forwardVector.z * moveAmount;

				player.timestamp = data.timestamp;
			}
		});

		// Server-side game loop
		this.setSimulationInterval(
			(delta) => this.updateLoop(delta),
			1000 / this.tickRate
		);
	}

	onJoin(client: Client, options: any) {
		this.handleJoin(client);
	}

	private handleJoin(client: Client<any, any>) {
		const spawnPositionIndex = this.clients.length - 1;
		const spawnPosition = this.spawnPositions[spawnPositionIndex];

		const newPlayer = new PlayerState();
		newPlayer.x = spawnPosition.x;
		newPlayer.y = spawnPosition.y;
		newPlayer.z = spawnPosition.z;
		newPlayer.dx = 0;
		newPlayer.dy = 0;
		newPlayer.dz = 1;

		// Initialize quaternion to identity (no rotation)
		newPlayer.qw = 1;
		newPlayer.qx = 0;
		newPlayer.qy = 0;
		newPlayer.qz = 0;

		newPlayer.timestamp = Date.now().toString();

		this.state.players.set(client.sessionId, newPlayer);
		console.log(client.sessionId, ' joined ');
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
