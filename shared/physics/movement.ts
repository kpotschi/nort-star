import * as THREE from 'three';
import CONFIG_SHARED from '../config/CONFIG_SHARED';

export const updateRotation = (
	deltaMs: number,
	dx: number,
	dz: number,
	target: THREE.Quaternion
): void => {
	if (dx !== 0) {
		const pitchAxis = new THREE.Vector3(1, 0, 0);
		const pitchQuaternion = new THREE.Quaternion().setFromAxisAngle(
			pitchAxis,
			(dx > 0 ? deltaMs : -deltaMs) * 0.01
		);
		target.multiplyQuaternions(pitchQuaternion, target);
	}

	// Roll (Z-axis)
	if (dz !== 0) {
		const rollAxis = new THREE.Vector3(0, 0, 1);
		const rollQuaternion = new THREE.Quaternion().setFromAxisAngle(
			rollAxis,
			(dz > 0 ? deltaMs : -deltaMs) * 0.01
		);
		target.multiplyQuaternions(rollQuaternion, target);
	}

	// const pitchAxis = new THREE.Vector3(1, 0, 0); // X-axis for pitch
	// const rollAxis = new THREE.Vector3(0, 0, 1); // Z-axis for roll
	// const pitchAmount = (dx * CONFIG_SHARED.CONTROLS.PITCH_SPEED * deltaMs) / 100;
	// const rollAmount = (dz * CONFIG_SHARED.CONTROLS.ROLL_SPEED * deltaMs) / 100;
	// const pitchQuat = new THREE.Quaternion().setFromAxisAngle(
	// 	pitchAxis,
	// 	pitchAmount
	// );
	// const rollQuat = new THREE.Quaternion().setFromAxisAngle(
	// 	rollAxis,
	// 	rollAmount
	// );
	// target.premultiply(pitchQuat);
	// target.premultiply(rollQuat);
	// target.normalize();
};

export const getForwardMovement = (
	deltaMs: number,
	quaternion: THREE.QuaternionLike,
	position: THREE.Vector3
): void => {
	const forwardDirection = new THREE.Vector3(0, 0, 1); // Local forward (-Z)
	forwardDirection.applyQuaternion(quaternion);

	position.addScaledVector(forwardDirection, deltaMs * 0.01);
};
