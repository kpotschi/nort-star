import { CONFIG } from './../../../client/src/config/config';
import { Spawn } from './../../../client/src/config/types.d';
import { Client, Room } from 'colyseus';
import { PlayerState, State } from './schema/MyRoomState';

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

		// this.setState(new State());

		this.onMessage('move', (client, data: PlayerState) => {
			const player = this.state.players.get(client.sessionId);

			const deltaMs = Number(data.timestamp) - Number(player.timestamp);

			if (player) {
				player.x += (player.dx * deltaMs) / 100;
				player.y += (player.dy * deltaMs) / 100;

				player.dx = Math.max(-1, Math.min(1, data.dx || 0));
				player.dy = Math.max(-1, Math.min(1, data.dy || 0));

				player.timestamp = data.timestamp;
			}
		});

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
		newPlayer.dx = 0;
		newPlayer.dy = 0;
		newPlayer.dz = 1;

		this.state.players.set(client.sessionId, newPlayer);
		console.log(client.sessionId, ' joined ');
	}

	onLeave(client: Client, consented: boolean) {
		console.log(client.id + ' left');

		this.state.players.delete(client.sessionId);
	}

	private updateLoop(deltaMs: number) {
		this.state.players.forEach((player: PlayerState) => {
			player.z += deltaMs / 100; // Apply constant forward motion
		});
	}
}
