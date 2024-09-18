import * as THREE from 'three';
import GameScene from '../../scenes/GameScene';

export default class Ring extends THREE.Mesh {
	constructor(scene: GameScene) {
		const geometry = new THREE.RingGeometry(4, 5, 8, 1, 0, Math.PI * 2);
		const material = new THREE.MeshStandardMaterial({
			color: 0xffff00,
			side: THREE.DoubleSide,
		});
		super(geometry, material);

		this.position.set(0, 0, 10);
		scene.add(this);
	}

	move() {
		this.rotation.z += 0.01;
	}
}
