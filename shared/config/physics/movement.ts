import * as THREE from 'three';
import { CONFIG } from '../config';

export const updateRotation = (
	deltaMs: number,
	dx: number,
	dz: number,
	target: THREE.Quaternion
): void => {
	// Create quaternions for pitch and roll
	const pitchAxis = new THREE.Vector3(1, 0, 0); // X-axis for pitch
	const rollAxis = new THREE.Vector3(0, 0, 1); // Z-axis for roll

	// Get input based on player direction
	const pitchAmount = (dx * CONFIG.CONTROLS.PITCH_SPEED * deltaMs) / 100;
	const rollAmount = (dz * CONFIG.CONTROLS.ROLL_SPEED * deltaMs) / 100;

	// Create rotation quaternions
	const pitchQuat = new THREE.Quaternion().setFromAxisAngle(
		pitchAxis,
		pitchAmount
	);
	const rollQuat = new THREE.Quaternion().setFromAxisAngle(
		rollAxis,
		rollAmount
	);

	// Apply the rotations to the ship's quaternion (order matters!)
	target.premultiply(pitchQuat);
	target.premultiply(rollQuat);

	// Normalize the quat to prevent drift
	target.normalize();
};
