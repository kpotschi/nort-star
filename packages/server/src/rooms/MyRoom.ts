import { Spawn } from './../../../client/src/config/types.d';
import { Client, Room } from 'colyseus';
import { Player, State } from './schema/MyRoomState';

export class GameRoom extends Room<State> {
	maxClients = 2;
	private spawnPositions: Spawn[] = [
		{ x: 0, y: 0, z: -100 },

		{ x: 0, y: 0, z: 100 },
	];
	onCreate(options: any) {
		this.setState(new State());

		this.onMessage('move', (client, data) => {
			const player = this.state.players.get(client.sessionId);

			if (player) {
				player.x = data.x;
				player.y = data.y;
				player.z = data.z;
				player.qx = data.qx;
				player.qy = data.qy;
				player.qz = data.qz;
				player.qw = data.qw;
			}
		});
	}

	// Called every time a client joins
	onJoin(client: Client, options: any) {
		console.log(client.id + ' joined');

		this.handleSpawn(client);
		this.state.players.set(client.sessionId, new Player());
		if (this.clients.length === this.maxClients) {
			console.log('Room is full, starting the game!');
			this.broadcast('start', { message: 'Game is starting!' });
		}
	}

	private handleSpawn(client: Client<any, any>) {
		const spawnPositionIndex = this.clients.length - 1; // Assign the spawn point based on client count
		const spawnPosition = this.spawnPositions[spawnPositionIndex];

		const newPlayer = new Player();
		newPlayer.x = spawnPosition.x;
		newPlayer.y = spawnPosition.y;
		newPlayer.z = spawnPosition.z;

		this.state.players.set(client.sessionId, newPlayer);

		// Send the spawn position to the client
		client.send('spawn', {
			x: spawnPosition.x,
			y: spawnPosition.y,
			z: spawnPosition.z,
		});
	}

	onLeave(client: Client, consented: boolean) {
		console.log(client.id + ' left');

		// Remove the player from the state
		this.state.players.delete(client.sessionId);

		// Optionally, handle game state when a player leaves (e.g., end game, notify others)
		this.broadcast('player_left', {
			message: `Player ${client.sessionId} has left the game.`,
		});
	}
}
