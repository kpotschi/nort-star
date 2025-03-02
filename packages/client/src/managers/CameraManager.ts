import * as THREE from 'three';
import App from '../app';
import { CONFIG } from '../../../../shared/config/config';
import Player from '../entities/Player';

export default class CameraManager extends THREE.PerspectiveCamera {
	private app: App;
	private tailOffset: THREE.Vector3;
	private lerpSpeed: number; // Speed of lerp

	constructor(app: App) {
		super(50, window.innerWidth / window.innerHeight, 0.1, 1000); // FOV, aspect, near, far planes
		this.app = app;

		// Define a tail offset relative to the spaceship (behind the spaceship)
		this.tailOffset = new THREE.Vector3(0, 0, -10); // Adjust as needed (x, y, z)

		// Initial camera position (default, will be updated in update method)
		this.position.set(
			CONFIG.CAMERA.DEBUG_SPAWN_POINT.x,
			CONFIG.CAMERA.DEBUG_SPAWN_POINT.y,
			CONFIG.CAMERA.DEBUG_SPAWN_POINT.z
		);

		// Set a lerp speed (the higher, the faster the interpolation)
		this.lerpSpeed = CONFIG.CAMERA.LERP_SPEED || 0.1; // Default if undefined
	}

	public update() {
		if (this.app.playerManager.self) {
			// const player: Player = this.app.playerManager.self;
			// // Calculate the target position behind the spaceship
			// const offset = this.tailOffset
			// 	.clone()
			// 	.applyQuaternion(player.spaceShip.quaternion); // Tail offset relative to spaceship's rotation
			// const targetPosition = player.spaceShip.position.clone().add(offset);
			// // Interpolate (lerp) between current and target position
			// this.position.lerp(targetPosition, this.lerpSpeed);
			// // Calculate spaceship's local up direction for camera alignment
			// const localUp = new THREE.Vector3(0, 1, 0).applyQuaternion(
			// 	player.spaceShip.quaternion
			// );
			// this.up.copy(localUp);
			// // Calculate forward direction to look at
			// const forwardDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(
			// 	player.spaceShip.quaternion
			// );
			// const lookAtPosition = player.spaceShip.position
			// 	.clone()
			// 	.add(forwardDirection);
			// // Smoothly interpolate the camera's orientation using slerp
			// const targetQuaternion = new THREE.Quaternion().setFromRotationMatrix(
			// 	new THREE.Matrix4().lookAt(this.position, lookAtPosition, localUp)
			// );
			// this.quaternion.slerp(targetQuaternion, this.lerpSpeed);
		}
	}
}
