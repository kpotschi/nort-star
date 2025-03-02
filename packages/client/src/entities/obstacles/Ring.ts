import * as THREE from 'three';
import GameScene from '../../scenes/GameScene';
import Obstacle from './Obstacle';
import { CONFIG } from '../../../../../shared/config/config';

export default class Ring extends Obstacle {
	constructor(scene: GameScene, index: number) {
		const geometry = new THREE.RingGeometry(4, 5, 8, 1, 0, Math.PI * 2);
		const colors = CONFIG.OBSTACLES.COLORS;
		const material = new THREE.MeshStandardMaterial({
			color: colors[Math.floor(Math.random() * colors.length)],
			side: THREE.DoubleSide,
		});
		super(scene, geometry, material);

		this.position.set(0, 0, 30 * index);
	}

	update() {
		this.rotateZ(CONFIG.OBSTACLES.MAX_Z_ROTATION);
		super.update();
	}
}
