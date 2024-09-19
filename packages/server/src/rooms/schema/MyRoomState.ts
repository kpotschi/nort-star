import { Schema, MapSchema, type } from '@colyseus/schema';

export class Player extends Schema {
	@type('number') x: number = 0;
	@type('number') y: number = 0;
	@type('number') z: number = 0;
	constructor() {
		super();
		this.x = Math.random() * 3;
		this.y = Math.random() * 3;

		this.z = Math.random() * 3;
	}
}

export class State extends Schema {
	@type({ map: Player }) players = new MapSchema<Player>();
}
