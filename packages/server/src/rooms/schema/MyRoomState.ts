import { Schema, MapSchema, type } from '@colyseus/schema';

export class Player extends Schema {
	@type('number') x: number = 0;
	@type('number') y: number = 0;
	@type('number') z: number = 0;
	@type('number') qx: number = 0;
	@type('number') qy: number = 0;
	@type('number') qz: number = 0;
	@type('number') qw: number = 0;

	constructor() {
		super();
	}
}

export class State extends Schema {
	@type({ map: Player }) players = new MapSchema<Player>();
}
