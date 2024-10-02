import { Schema, MapSchema, type } from '@colyseus/schema';
import * as THREE from 'three';

export class Position extends Schema {
	@type('number') x: number = 0;
	@type('number') y: number = 0;
	@type('number') z: number = 0;
}

class Rotation extends Schema {
	@type('number') qx: number = 0;
	@type('number') qy: number = 0;
	@type('number') qz: number = 0;
	@type('number') qw: number = 1;
}

export class Inputs extends Schema {
	@type({ map: 'boolean' }) keys = new MapSchema<boolean>();
}

export class PlayerState extends Schema {
	@type(Position) position = new Position();
	@type(Inputs) inputs = new Inputs();
	@type(Rotation) rotation = new Rotation();
	@type('number') timestamp: number = 0; // Track the last time the player state was updated

	constructor() {
		super();
	}
}

export class State extends Schema {
	@type({ map: PlayerState }) players = new MapSchema<PlayerState>();
}

export type StateInput = {
	position: { x: number; y: number; z: number };
	clientTimestamp: number;
	inputs: { [key: string]: boolean };
};

export type StateOutput = {
	position: { x: number; y: number; z: number };
	rotation: { qx: number; qy: number; qz: number; qw: number };
	timestamp: number;
};
