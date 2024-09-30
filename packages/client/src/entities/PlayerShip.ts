import { CONFIG } from '../config/config';
import { Spawn } from '../config/types';
import GameScene from '../scenes/GameScene';
import Spaceship from './Spaceship';
import * as THREE from 'three';

export default class PlayerShip extends Spaceship {
	public speed: number = CONFIG.GAMEPLAY.START_SPEED;

	constructor(scene: GameScene, spawn: Spawn) {
		super(scene, spawn);
		console.log('created playership');
	}

	public handleInput(delta: number) {
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

		this.direction = new THREE.Vector3(0, 0, 1)
			.applyQuaternion(this.quaternion)
			.normalize();

		const forwardMovement = this.direction
			.clone()
			.multiplyScalar(this.speed * delta);
		this.position.add(forwardMovement);

		const { x, y, z } = this.position;
		const q = this.quaternion.clone().normalize();

		this.scene.room.send('move', {
			qx: q.x,
			qy: q.y,
			qz: q.z,
			qw: q.w,
		});
	}
}
