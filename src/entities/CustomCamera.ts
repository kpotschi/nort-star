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
		// Get the spaceship from the scene
		const spaceship = this.app.currentScene.spaceship;

		// Clone the tail offset so it can be transformed without affecting the original
		const offset = this.tailOffset.clone();

		// Apply the spaceship's rotation to the offset to move the camera relative to the ship's orientation
		offset.applyQuaternion(spaceship.quaternion);

		// Target position: spaceship's position plus the rotated offset
		const targetPosition = spaceship.position.clone().add(offset);

		// Lerp the camera's position to smoothly move toward the target position
		this.position.lerp(targetPosition, this.lerpSpeed);

		// Compute the spaceship's local up vector by rotating the world up vector (0, 1, 0)
		const localUp = new THREE.Vector3(0, 1, 0).applyQuaternion(
			spaceship.quaternion
		);

		// Update the camera's up vector to match the spaceship's up vector
		this.up.copy(localUp);

		// Make the camera look at a point slightly in front of the spaceship for a smooth following effect
		const forwardDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(
			spaceship.quaternion
		);
		const lookAtPosition = spaceship.position.clone().add(forwardDirection);

		// Slerp the quaternion to smoothly rotate the camera
		const targetQuaternion = new THREE.Quaternion().setFromRotationMatrix(
			new THREE.Matrix4().lookAt(this.position, lookAtPosition, localUp)
		);
		this.quaternion.slerp(targetQuaternion, this.lerpSpeed);
	}
}
