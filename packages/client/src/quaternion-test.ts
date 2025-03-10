import * as THREE from 'three';

const ROTATION_SPEED = 0.01; // Adjust as needed

const updateRotation = (deltaMs: number, dx: number, dz: number, target) => {
	if (dx !== 0) {
		const pitchAxis = new THREE.Vector3(1, 0, 0);
		const pitchQuaternion = new THREE.Quaternion().setFromAxisAngle(
			pitchAxis,
			(dx > 0 ? 1 : -1) * deltaMs * 0.01
		);
		target.premultiply(pitchQuaternion);
	}

	// if (dz !== 0) {
	// 	const rollAxis = new THREE.Vector3(0, 0, 1);
	// 	const rollQuaternion = new THREE.Quaternion().setFromAxisAngle(
	// 		rollAxis,
	// 		(dz > 0 ? 1 : -1) * deltaMs * 0.01
	// 	);
	// 	target.premultiply(rollQuaternion);
	// }
};

export const run = () => {
	// quaternion long
	const quaternionLong = new THREE.Quaternion(0, 0, 0, 1);

	updateRotation(222, 1, 1, quaternionLong);
	// const longVec = new THREE.Vector3(0, 0, 0);

	console.log(
		'long quat',
		quaternionLong.w,
		quaternionLong.x,
		quaternionLong.y,
		quaternionLong.z
	);

	// console.log('long pos', longVec.x, longVec.y, longVec.z);

	// quaternion sequence

	const vector = new THREE.Vector3(0, 0, 0);
	//1

	const quaternion1 = new THREE.Quaternion(0, 0, 0, 1);

	updateRotation(100, 1, 1, quaternion1);

	// getForwardMovement(delta1, quaternion1, vector);

	//2
	const quaternion2 = new THREE.Quaternion().copy(quaternion1);

	updateRotation(90, 1, 1, quaternion2);

	// getForwardMovement(delta2, quaternion2, vector);

	//3
	const quaternion3 = new THREE.Quaternion().copy(quaternion2);

	updateRotation(32, 1, 1, quaternion3);

	// getForwardMovement(delta3, quaternion3, vector);

	console.log(
		'seq quat',
		quaternion3.w,
		quaternion3.x,
		quaternion3.y,
		quaternion3.z
	);

	// console.log('seq pos', vector.x, vector.y, vector.z);
};
