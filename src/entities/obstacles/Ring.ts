import * as THREE from 'three';
import GameScene from '../../scenes/GameScene';
import Obstacle from './Obstacle';

export default class Ring extends Obstacle {
	constructor(scene: GameScene, index: number) {
		const geometry = new THREE.RingGeometry(4, 5, 8, 1, 0, Math.PI * 2);
		const material = new THREE.MeshStandardMaterial({
			color: 0xffff00,
			side: THREE.DoubleSide,
		});
		super(scene, geometry, material);

		this.position.set(0, 0, 30 * index);
	}

	move() {
		this.rotation.z += 0.01;
		super.move();
	}
}
