import * as THREE from 'three';
import App from '../app';
import { CONFIG } from '../config/config';

export default class CustomCamera extends THREE.PerspectiveCamera {
	private app: App;
	private tailOffset: THREE.Vector3;
	private lerpSpeed: number; // Speed of lerp

	constructor(app: App) {
		super(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.app = app;

		// Define a tail offset relative to the spaceship (behind the spaceship)
		this.tailOffset = new THREE.Vector3(0, 2, -10); // Adjust as needed (x, y, z)

		// Initial camera position (default, will be updated in update method)
		this.position.set(0, 2, -10);

		// Set a lerp speed (the higher, the faster the interpolation)
		this.lerpSpeed = CONFIG.CAMERA.LERP_SPEED; // Adjust to make the lerp faster or slower
	}

	public update() {
		if (this.app.currentScene?.spaceship) {
			const spaceship = this.app.currentScene.spaceship;

			const offset = this.tailOffset.clone();

			offset.applyQuaternion(spaceship.quaternion);

			const targetPosition = spaceship.position.clone().add(offset);

			this.position.lerp(targetPosition, this.lerpSpeed);

			const localUp = new THREE.Vector3(0, 1, 0).applyQuaternion(
				spaceship.quaternion
			);

			this.up.copy(localUp);

			const forwardDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(
				spaceship.quaternion
			);
			const lookAtPosition = spaceship.position.clone().add(forwardDirection);

			const targetQuaternion = new THREE.Quaternion().setFromRotationMatrix(
				new THREE.Matrix4().lookAt(this.position, lookAtPosition, localUp)
			);
			this.quaternion.slerp(targetQuaternion, this.lerpSpeed);
		}
	}
}
