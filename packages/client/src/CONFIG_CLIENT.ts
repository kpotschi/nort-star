import CONFIG_SHARED from '../../../shared/config/CONFIG_SHARED';

const CONFIG = {
	...CONFIG_SHARED,
	RENDER: {
		PASS: {
			THRESHOLD: 0,
			STRENGTH: 0,
			RADIUS: 0,
			EXPOSURE: 1,
		},
	},

	RECONCILIATION: {
		HEARTBEAT_MS: 100,
		POSITION_LERP_FACTOR: 0.3,
		ROTATION_LERP_FACTOR: 0.3, // Add this line
		POSITION_ERROR_THRESHOLD: 0.001, // Add this line
		ROTATION_ERROR_THRESHOLD: 0.001, // Add this line
	},
};

export default CONFIG;
