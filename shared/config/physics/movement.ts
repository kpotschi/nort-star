import * as THREE from 'three';
import CONFIG_SHARED from '../CONFIG_SHARED';
import { PlayerState } from '../../../packages/server/src/rooms/schema/MyRoomState';

export const updateRotation = (
	deltaMs: number,
	dx: number,
	dz: number,
	target: THREE.Quaternion
): void => {
	const pitchAxis = new THREE.Vector3(1, 0, 0); // X-axis for pitch
	const rollAxis = new THREE.Vector3(0, 0, 1); // Z-axis for roll

	const pitchAmount = (dx * CONFIG_SHARED.CONTROLS.PITCH_SPEED * deltaMs) / 100;
	const rollAmount = (dz * CONFIG_SHARED.CONTROLS.ROLL_SPEED * deltaMs) / 100;

	const pitchQuat = new THREE.Quaternion().setFromAxisAngle(
		pitchAxis,
		pitchAmount
	);
	const rollQuat = new THREE.Quaternion().setFromAxisAngle(
		rollAxis,
		rollAmount
	);

	target.multiply(pitchQuat);
	target.multiply(rollQuat);

	target.normalize();
};

export const getForwardMovement = (
	deltaMs: number,
	quaternion: THREE.QuaternionLike
): THREE.Vector3 => {
	const forwardVector = new THREE.Vector3(0, 0, 1);
	const moveAmount = (CONFIG_SHARED.GAMEPLAY.START_SPEED * deltaMs) / 100;

	forwardVector.applyQuaternion(quaternion);

	forwardVector.normalize();

	forwardVector.multiplyScalar(moveAmount);

	return forwardVector;
};
