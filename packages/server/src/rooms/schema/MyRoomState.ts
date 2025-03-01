import { Schema, MapSchema, type } from '@colyseus/schema';

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
	@type('number') dy = 0; // Direction Y
	@type('number') dz = 1; // Direction Z
}

export class State extends Schema {
	@type({ map: PlayerState }) players = new MapSchema<PlayerState>();
}

// export class LocalBufferPlayerState extends BaseState {
// 	@type('number') timestamp = 0;
// }
