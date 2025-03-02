import { MapSchema, Schema, type } from '@colyseus/schema';

export class Inputs extends Schema {
	@type({ map: 'boolean' }) keys = new MapSchema<boolean>();
}

export class PlayerState extends Schema {
	@type(Inputs) inputs = new Inputs();
	@type('string') timestamp = Date.now().toString();
	@type('number') x = 0;
	@type('number') y = 0;
	@type('number') z = 0;

	@type('number') dx = 0; // Direction X
	@type('number') dz = 0; // Direction Z

	@type('number') qw = 1; // Quaternion W
	@type('number') qx = 0; // Quaternion X
	@type('number') qy = 0; // Quaternion Y
	@type('number') qz = 0; // Quaternion Z
}

export class State extends Schema {
	@type({ map: PlayerState }) players = new MapSchema<PlayerState>();
}
