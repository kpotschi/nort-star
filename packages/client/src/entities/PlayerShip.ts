import * as THREE from 'three';
import {
	PlayerState,
	Position,
} from '../../../server/src/rooms/schema/MyRoomState';
import { CONFIG } from '../config/config';
import GameScene from '../scenes/GameScene';
import Spaceship from './Spaceship';

export default class PlayerShip extends Spaceship {
	public speed: number = CONFIG.GAMEPLAY.START_SPEED;

	constructor(scene: GameScene, player: PlayerState) {
		super(scene, player);
		console.log('created playership');
	}

	public handleInput(delta: number) {
		// if (this.scene.app.controls.keysPressed['w'] === true) {
		// 	this.rotateOnAxis(
		// 		new THREE.Vector3(1, 0, 0),
		// 		CONFIG.CONTROLS.ROTATION_SPEED * delta
		// 	);
		// }
		// if (this.scene.app.controls.keysPressed['s']) {
		// 	this.rotateOnAxis(
		// 		new THREE.Vector3(-1, 0, 0),
		// 		CONFIG.CONTROLS.ROTATION_SPEED * delta
		// 	);
		// }
		// if (this.scene.app.controls.keysPressed['a']) {
		// 	this.rotateOnAxis(
		// 		new THREE.Vector3(0, 1, 0),
		// 		CONFIG.CONTROLS.ROTATION_SPEED * delta
		// 	);
		// }
		// if (this.scene.app.controls.keysPressed['d']) {
		// 	this.rotateOnAxis(
		// 		new THREE.Vector3(0, -1, 0),
		// 		CONFIG.CONTROLS.ROTATION_SPEED * delta
		// 	);
		// }
		// this.direction = new THREE.Vector3(0, 0, 1)
		// 	.applyQuaternion(this.quaternion)
		// 	.normalize();
		// const forwardMovement = this.direction
		// 	.clone()
		// 	.multiplyScalar(this.speed * delta);
		// this.position.add(forwardMovement);
		// const pos = new Position(this.position);
		// const q = this.quaternion.clone().normalize();
		// this.scene.room.send<Player>('move', {
		// 	position: pos,
		// });
	}
}
