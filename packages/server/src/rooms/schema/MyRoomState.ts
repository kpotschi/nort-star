import { Schema, MapSchema, type } from '@colyseus/schema';

export class Inputs extends Schema {
	@type({ map: 'boolean' }) keys = new MapSchema<boolean>();
}

class BaseState extends Schema {
	@type('number') x = 0;
	@type('number') y = 0;
	@type('number') dx = 0; // Direction X
	@type('number') dy = 0; // Direction Y
}

export class PlayerState extends BaseState {
	@type(Inputs) inputs = new Inputs();
	@type('string') timestamp = Date.now().toString();
}

export class State extends Schema {
	@type({ map: PlayerState }) players = new MapSchema<PlayerState>();
}

export class LocalBufferPlayerState extends PlayerState {
	@type('number') numericTimestamp = 0;
}
