import { MapSchema, Schema, type } from '@colyseus/schema';

export class Inputs extends Schema {
	@type({ map: 'boolean' }) keys = new MapSchema<boolean>();
}

export class PlayerState extends Schema {
	@type(Inputs) inputs = new Inputs();
	@type('number') timestamp = Date.now();
	@type('number') x = 0;
	@type('number') y = 0;
	@type('number') z = 0;

	@type('number') dx = 0; // Direction X
	@type('number') dy = 0; // Direction Y

	// @type('number') qw = 1; // Quaternion W
	// @type('number') qx = 0; // Quaternion X
	// @type('number') qy = 0; // Quaternion Y
	// @type('number') qz = 0; // Quaternion Z

	@type('number') u = 0;
	@type('number') v = 0;
	@type('number') w = 0;

	@type('string') color = '#ffffff'; // Default color
}

export class State extends Schema {
	@type({ map: PlayerState }) players = new MapSchema<PlayerState>();
}
