import * as THREE from 'three';
import GameScene from '../../scenes/GameScene';
import { CONFIG } from '../../config/config';

export default class Obstacle extends THREE.Mesh {
	protected scene: GameScene;
	constructor(
		scene: GameScene,
		geometry: THREE.BufferGeometry,
		material: THREE.Material
	) {
		super(geometry, material);
		this.scene = scene;
		scene.add(this);
	}

	public move() {
		// this.position.z -= 0.1;
		// this.position.setY(this.position.y + this.scene.spaceship.velocityX);
		// this.position.setX(this.position.x - this.scene.spaceship.velocityY);
		this.rotateAroundShip();
		// this.resetPosition();
	}
	private resetPosition() {
		if (this.position.z < 0) this.position.set(0, 0, 20);
	}
	private rotateAroundShip() {
		const currentAngle = Math.atan2(this.position.x, this.position.z); // atan2 gives the angle based on current X and Z position

		// Add a delta angle (e.g., based on the ship's velocity or a constant value for continuous rotation)
		const rotationSpeed = this.scene.spaceship.velocityY * 0.01; // Adjust the multiplier to control rotation speed
		const newAngle = currentAngle - rotationSpeed; // Update the angle by adding the delta

		// Calculate the distance from the obstacle to the spaceship (0,0,0)
		const distanceFromShip = this.position.distanceTo(
			new THREE.Vector3(0, 0, 0)
		);

		// Calculate the new X and Z positions based on the updated angle
		const newX = distanceFromShip * Math.sin(newAngle); // Calculate new X position
		const newZ = distanceFromShip * Math.cos(newAngle); // Calculate new Z position
		this.position.set(newX, this.position.y, newZ);

		// this.position.setX(this.position.x - this.scene.spaceship.velocityY);
		// Optional: Add some lateral movement based on spaceship velocity (if needed)
		// this.position.x += this.scene.spaceship.velocityX * 0.01; // Adjust the multiplier for how much influence the ship has
		// this.position.y += this.scene.spaceship.velocityY * 0.01; // Adjust the multiplier for how much influence the ship has
	}
}
