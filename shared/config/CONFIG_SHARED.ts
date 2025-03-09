const CONFIG_SHARED = {
	GAMEPLAY: {
		START_SPEED: 1,
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

	CLIENT_CONFIG: {
		BUFFER_LENGTH: 100,
	},
};

export default CONFIG_SHARED;
