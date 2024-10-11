import { PlayerState } from './../../../server/src/rooms/schema/MyRoomState';
import App from '../app';
import Spaceship from './Spaceship';
import PlayerManager from '../managers/PlayerManager';

export default class Player {
	readonly app: App;
	public isSelf: boolean = false;
	public spaceShip: Spaceship;
	public state: PlayerState;
	readonly playerManager: PlayerManager;
	public velocity: { x: number; y: number };

	constructor(
		app: App,
		playerState: PlayerState,
		playerManager: PlayerManager,
		isSelf = false
	) {
		this.app = app;
		this.velocity = { x: 0, y: 0 };
		this.state = playerState;
		this.isSelf = isSelf;
		this.playerManager = playerManager;
		this.spaceShip = new Spaceship(app.currentScene, this.playerManager);
	}

	public update(deltaMs: number) {
		this.process(deltaMs);
		this.spaceShip.updatePosition();
	}

	private process(deltaMs: number) {
		if (this.isSelf) {
			this.playerManager.updateState(deltaMs);
			// let { dx, dy } = this.handleInput();
		}
	}

	public predictPosition(deltaMs: number) {
		return {
			x: this.spaceShip.position.x + ((this.velocity.x * deltaMs) / 100) * 2,
			y: this.spaceShip.position.y + (this.velocity.y * deltaMs) / 100,
		};
	}
}
