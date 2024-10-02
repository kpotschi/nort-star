import * as THREE from 'three';
import {
	PlayerState,
	StateInput,
} from '../../../server/src/rooms/schema/MyRoomState';
import App from '../app';
import StateBuffer from '../managers/StateBuffer';
import GameScene from '../scenes/GameScene';
import Player from './Player';
import { CONFIG } from '../config/config';

export default class Spaceship extends THREE.Mesh {
	protected scene: GameScene;
	public direction: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
	protected app: App;
	public serverPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
	public serverQ: THREE.Quaternion = new THREE.Quaternion(0, 0, 1);
	public stateBuffer: StateBuffer;
	private speed: number = 10;
	private player: Player;

	constructor(scene: GameScene, player: Player, playerState?: PlayerState) {
		const material = Spaceship.getMaterial();
		const geometry = Spaceship.getGeometry();
		super(geometry, material);
		this.stateBuffer = new StateBuffer();
		this.player = player;
		this.scene = scene;
		this.scene.add(this);

		if (playerState) {
			const { x, y, z } = playerState.position;
			this.position.set(x, y, z);
			this.lookAt(0, 0, 0);
		}
	}

	static getMaterial(): THREE.Material {
		return new THREE.MeshStandardMaterial({
			color: 0x00ff00,
			metalness: 0, // Make it interact with light properly
			roughness: 0.1, // Shiny appearance
			// side: THREE.DoubleSide, // Render both sides of the faces
		});
	}

	static getGeometry(): THREE.BufferGeometry {
		const geometry = new THREE.BufferGeometry();
		const vertices = new Float32Array([
			0,
			0,
			2, // 1 front
			1,
			0,
			0, // 1 left
			0,
			0.5,
			0, // 1 top

			-1,
			0,
			0, // 2 right
			0,
			0,
			2, // 2 front
			0,
			0.5,
			0, // 2 top
			0,
			0,
			-1, // 3 back
			0,
			0.5,
			0, // 3 top
			1,
			0,
			0, // 3 left
			0,
			0,
			-1, // 4 back
			-1,
			0,
			0, // 4 right
			0,
			0.5,
			0, // 4 top
			0,
			0,
			2, // 5 front
			0,
			-0.5,
			0, // 5 bottom
			1,
			0,
			0, // 5 left
			0,
			0,
			2, // 6 front
			-1,
			0,
			0, // 6 right
			0,
			-0.5,
			0, // 6 bottom
			0,
			0,
			-1, // 7 back
			1,
			0,
			0, // 7 left
			0,
			-0.5,
			0, // 7 bottom
			0,
			0,
			-1, // 8 back
			0,
			-0.5,
			0, // 8 bottom

			-1,
			0,
			0, // 8 right
		]);

		geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
		geometry.computeVertexNormals();
		return geometry;
	}

	public update(delta: number) {
		this.direction = new THREE.Vector3(0, 0, 1)
			.applyQuaternion(this.quaternion)
			.normalize();
		const forwardMovement = this.direction
			.clone()
			.multiplyScalar(this.speed * delta);
		this.position.add(forwardMovement);
		if (this.player.isSelf) {
			this.handleInput(delta);
			this.handleLocalState();
		}

		// const currentTime = Date.now() + 30;
		// const interpolatedState =
		// 	this.stateBuffer.getInterpolatedState(currentTime);
		// if (interpolatedState) {
		// 	this.position.copy(interpolatedState.position);
		// 	this.quaternion.copy(interpolatedState.rotation);
		// } else {
		// 	this.position.lerp(this.serverPosition, 0.1);
		// 	this.quaternion.slerp(this.serverQ, 0.1);
		// }
	}

	private handleLocalState() {
		const stateInput: StateInput = {
			position: this.app.playerManager.self.spaceShip.position,
			inputs: this.app.controls.keysPressed,
			clientTimestamp: Date.now(),
		};
		this.app.playerManager.localBuffer.add(stateInput);
		this.app.currentScene.room.send<StateInput>('move', stateInput);
	}

	private handleInput(delta: number) {
		if (this.scene.app.controls.keysPressed['w'] === true) {
			this.rotateOnAxis(
				new THREE.Vector3(1, 0, 0),
				CONFIG.CONTROLS.ROTATION_SPEED * delta
			);
		}
		if (this.scene.app.controls.keysPressed['s']) {
			this.rotateOnAxis(
				new THREE.Vector3(-1, 0, 0),
				CONFIG.CONTROLS.ROTATION_SPEED * delta
			);
		}
		if (this.scene.app.controls.keysPressed['a']) {
			this.rotateOnAxis(
				new THREE.Vector3(0, 1, 0),
				CONFIG.CONTROLS.ROTATION_SPEED * delta
			);
		}
		if (this.scene.app.controls.keysPressed['d']) {
			this.rotateOnAxis(
				new THREE.Vector3(0, -1, 0),
				CONFIG.CONTROLS.ROTATION_SPEED * delta
			);
		}
	}
}
