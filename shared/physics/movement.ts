import * as THREE from 'three';

export const updateRotation = (
	deltaMs: number,
	direction: THREE.Vector3,
	target: THREE.Euler
): void => {
	if (direction.x !== 0) {
		const pitchChange = direction.x * deltaMs * 0.01;
		target.x += pitchChange;
	}

	// Roll (Z-axis)
	if (direction.y !== 0) {
		const rollChange = direction.y * deltaMs * 0.01;
		target.z += rollChange;
	}
};

export const getForwardMovement = (
	deltaMs: number,
	euler: THREE.Euler,
	position: THREE.Vector3
): void => {
	const forwardDirection = new THREE.Vector3(0, 0, 1);
	forwardDirection.applyEuler(euler);

	position.addScaledVector(forwardDirection, deltaMs * 0.001);
};
