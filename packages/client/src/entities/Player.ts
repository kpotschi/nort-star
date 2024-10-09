import { PlayerState } from './../../../server/src/rooms/schema/MyRoomState';
import App from '../app';
import Spaceship from './Spaceship';

export default class Player {
	readonly app: App;
	public isSelf: boolean = false;
	public spaceShip: Spaceship;
	public state: PlayerState;

	constructor(app: App, playerState: PlayerState, isSelf = false) {
		this.app = app;
		this.state = playerState;
		this.isSelf = isSelf;
		this.spaceShip = new Spaceship(app.currentScene, this);
	}

	public update(deltaMs: number) {
		this.spaceShip.update(deltaMs);
	}
}
