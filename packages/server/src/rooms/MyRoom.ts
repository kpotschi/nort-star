import { Spawn } from './../../../client/src/config/types.d';
import { Client, Room } from 'colyseus';
import {
	Inputs,
	PlayerState,
	Position,
	State,
	StateInput,
} from './schema/MyRoomState';
import * as THREE from 'three';

export class GameRoom extends Room<State> {
	readonly maxClients = 2;
	readonly spawnPositions: Spawn[] = [
		{ x: 0, y: 0, z: -100 },
		{ x: 0, y: 0, z: 100 },
	];

	onCreate() {
		this.setState(new State());

		this.onMessage('move', (client, data: StateInput) => {
			const player = this.state.players.get(client.sessionId);

			if (player) {
				Object.keys(data.inputs).forEach((key) => {
					player.inputs.keys.set(key, data.inputs[key]);
				});
			}
		});
		this.setSimulationInterval((deltaTime) => this.updateLoop(deltaTime));
	}

	onJoin(client: Client, options: any) {
		this.handleJoin(client);
	}

	private handleJoin(client: Client<any, any>) {
		const spawnPositionIndex = this.clients.length - 1; // Assign the spawn point based on client count
		const spawnPosition = this.spawnPositions[spawnPositionIndex];

		const newPlayer = new PlayerState();
		newPlayer.position = new Position(spawnPosition);

		this.state.players.set(client.sessionId, newPlayer);
	}

	onLeave(client: Client, consented: boolean) {
		console.log(client.id + ' left');

		this.state.players.delete(client.sessionId);
	}

	updateLoop(delta: number) {
		this.state.players.forEach((player: PlayerState) => {
			// Constant forward movement
			let direction = new THREE.Vector3(0, 0, 1)
				.applyQuaternion(
					new THREE.Quaternion(
						player.rotation.qx,
						player.rotation.qy,
						player.rotation.qz,
						player.rotation.qw
					)
				)
				.normalize();

			const forwardSpeed = 10;
			const forwardMovement = direction.multiplyScalar(
				(forwardSpeed * delta) / 1000
			);
			player.position.x += forwardMovement.x;
			player.position.y += forwardMovement.y;
			player.position.z += forwardMovement.z;

			// Handle Up and Down Movement
			const verticalSpeed = 5; // Speed for moving up and down (units per second)
			if (player.inputs.keys.get('s')) {
				// Move up
				player.position.y += (verticalSpeed * delta) / 1000;
			}

			if (player.inputs.keys.get('w')) {
				// Move down
				player.position.y -= (verticalSpeed * delta) / 1000;
			}

			// Handle rotation left and right
			const rotationSpeed = 0.05; // Rotation speed (radians per second)
			if (player.inputs.keys.get('a')) {
				// Rotate left
				const quaternion = new THREE.Quaternion();
				quaternion.setFromAxisAngle(
					new THREE.Vector3(0, 1, 0),
					(rotationSpeed * delta) / 1000
				);
				const currentRotation = new THREE.Quaternion(
					player.rotation.qx,
					player.rotation.qy,
					player.rotation.qz,
					player.rotation.qw
				);
				currentRotation.multiply(quaternion);
				player.rotation.qx = currentRotation.x;
				player.rotation.qy = currentRotation.y;
				player.rotation.qz = currentRotation.z;
				player.rotation.qw = currentRotation.w;
			}

			if (player.inputs.keys.get('d')) {
				// Rotate right
				const quaternion = new THREE.Quaternion();
				quaternion.setFromAxisAngle(
					new THREE.Vector3(0, 1, 0),
					(-rotationSpeed * delta) / 1000
				);
				const currentRotation = new THREE.Quaternion(
					player.rotation.qx,
					player.rotation.qy,
					player.rotation.qz,
					player.rotation.qw
				);
				currentRotation.multiply(quaternion);
				player.rotation.qx = currentRotation.x;
				player.rotation.qy = currentRotation.y;
				player.rotation.qz = currentRotation.z;
				player.rotation.qw = currentRotation.w;
			}

			// Update the timestamp to indicate that the player's state has been updated
			player.timestamp = Date.now();
		});
	}
}
