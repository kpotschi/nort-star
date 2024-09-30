import { Spawn } from './../../../client/src/config/types.d';
import { Client, Room } from 'colyseus';
import { Player, State } from './schema/MyRoomState';
import * as THREE from 'three';

export class GameRoom extends Room<State> {
	maxClients = 2;
	private spawnPositions: Spawn[] = [
		{ x: 0, y: 0, z: -100 },
		{ x: 0, y: 0, z: 100 },
	];

	onCreate() {
		this.setState(new State());

		this.onMessage('move', (client, data) => {
			const player = this.state.players.get(client.sessionId);

			if (player) {
				// player.x = data.x;
				// player.y = data.y;
				// player.z = data.z;
				player.qx = data.qx;
				player.qy = data.qy;
				player.qz = data.qz;
				player.qw = data.qw;
			}
		});
		this.setSimulationInterval((deltaTime) => this.updateLoop(deltaTime));
	}

	// Called every time a client joins
	onJoin(client: Client, options: any) {
		this.handleJoin(client);
		// this.state.players.set(client.sessionId, new Player());
		// if (this.clients.length === this.maxClients) {
		// 	console.log('Room is full, starting the game!');
		// 	this.broadcast('start', { message: 'Game is starting!' });
		// }
	}

	private handleJoin(client: Client<any, any>) {
		const spawnPositionIndex = this.clients.length - 1; // Assign the spawn point based on client count
		const spawnPosition = this.spawnPositions[spawnPositionIndex];

		const newPlayer = new Player();
		newPlayer.x = spawnPosition.x;
		newPlayer.y = spawnPosition.y;
		newPlayer.z = spawnPosition.z;

		this.state.players.set(client.sessionId, newPlayer);
	}

	onLeave(client: Client, consented: boolean) {
		console.log(client.id + ' left');

		this.state.players.delete(client.sessionId);
	}

	updateLoop(delta: number) {
		this.state.players.forEach((player: Player) => {
			// Get the player's current direction from the quaternion
			const direction = new THREE.Vector3(0, 0, 1)
				.applyQuaternion(
					new THREE.Quaternion(player.qx, player.qy, player.qz, player.qw)
				)
				.normalize();

			// Calculate the forward movement based on speed and delta time
			const speed = 10; // You can make this configurable per player if needed
			const forwardMovement = direction.multiplyScalar((speed * delta) / 1000); // divide delta by 1000 to convert ms to seconds

			// Update the player's position
			player.x += forwardMovement.x;
			player.y += forwardMovement.y;
			player.z += forwardMovement.z;

			// Here you could also add collision detection or other game logic
		});
	}
}
