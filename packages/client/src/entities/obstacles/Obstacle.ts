import * as THREE from 'three';
import GameScene from '../../scenes/GameScene';
import { CONFIG } from '../../../../../shared/config/config';

export default class Obstacle extends THREE.Mesh {
	protected scene: GameScene;
	protected speed: number; // Speed of movement

	constructor(
		scene: GameScene,
		geometry: THREE.BufferGeometry,
		material: THREE.Material
	) {
		super(geometry, material);
		this.scene = scene;
		this.speed = 0.1; // You can adjust speed in the config
		scene.add(this);
	}

	public update() {
		const spaceship = this.scene.spaceship; // Assuming your GameScene has a spaceship reference
		const forwardDirection = new THREE.Vector3(0, 0, 1).applyQuaternion(
			spaceship.quaternion
		);
		const moveDirection = forwardDirection.clone().negate();
		moveDirection.multiplyScalar(this.speed);
		this.position.add(moveDirection);
	}
}
