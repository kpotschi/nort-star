import { Schema, MapSchema, type } from '@colyseus/schema';

export class Inputs extends Schema {
	@type({ map: 'boolean' }) keys = new MapSchema<boolean>();
}

class BaseState extends Schema {
	@type('number') x = 0;
	@type('number') y = 0;
	@type('number') z = 0;

	@type('number') dx = 0; // Direction X
	@type('number') dy = 0; // Direction Y
	@type('number') dz = 1; // Direction Z
}

export class PlayerState extends BaseState {
	@type(Inputs) inputs = new Inputs();
	@type('string') timestamp = Date.now().toString();
}

export class State extends Schema {
	@type({ map: PlayerState }) players = new MapSchema<PlayerState>();
}

export class LocalBufferPlayerState extends BaseState {
	@type('number') timestamp = 0;
}
