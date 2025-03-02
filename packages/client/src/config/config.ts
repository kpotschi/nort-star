export const CONFIG = {
	GAMEPLAY: {
		START_SPEED: 1,
	},
	RENDER: {
		PASS: {
			THRESHOLD: 0,
			STRENGTH: 0.5,
			RADIUS: 0,
			EXPOSURE: 1,
		},
	},
	PLAYER: {
		// SPEED: 10,
	},
	CONTROLS: {
		// pitch
		MAX_PITCH_DEGREES: 45,
		PITCH_SPEED: 0.1,
		// roll
		MAX_ROLL_DEGREES: 45,
		ROLL_SPEED: 0.1,
	},
	BACKGROUND: {
		ROTATION_SPEED: 0.03,
	},
	OBSTACLES: {
		MAX_Z_ROTATION: 0.01,
		COLORS: [0xff0000, 0x00ff00, 0x0000ff],
	},
	CAMERA: {
		LERP_SPEED: 0.1,
		DEBUG_SPAWN_POINT: {
			x: 20,
			y: 20,
			z: -20,
		},
	},
	SERVER_RECON: {
		HEARTBEAT_MS: 100,
		POSITION_LERP_FACTOR: 0.3,
		ROTATION_LERP_FACTOR: 0.3, // Add this line
		POSITION_ERROR_THRESHOLD: 0.001, // Add this line
		ROTATION_ERROR_THRESHOLD: 0.001, // Add this line
	},
	CLIENT_CONFIG: {
		BUFFER_LENGTH: 100,
	},
};
