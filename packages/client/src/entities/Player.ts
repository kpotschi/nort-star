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

	constructor(
		app: App,
		playerState: PlayerState,
		playerManager: PlayerManager,
		isSelf = false
	) {
		this.app = app;
		this.state = playerState;
		this.isSelf = isSelf;
		this.playerManager = playerManager;
		this.spaceShip = new Spaceship(app.currentScene, this.playerManager);
	}

	public update(deltaMs: number) {
		this.spaceShip.update(deltaMs);
	}
}
