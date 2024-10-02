import { PlayerState } from './../../../server/src/rooms/schema/MyRoomState';
import { StateInput } from '../../../server/src/rooms/schema/MyRoomState';
import App from '../app';
import Spaceship from './Spaceship';

export default class Player {
	private app: App;
	public isSelf: boolean = false;
	public spaceShip: Spaceship;
	public state: PlayerState;

	constructor(app: App, playerState: PlayerState, isSelf = false) {
		this.app = app;
		this.state = playerState;
		this.isSelf = isSelf;
		this.spaceShip = new Spaceship(app.currentScene, this);
	}

	public update(delta: number) {
		this.spaceShip.update(delta);
		if (this.isSelf)
			this.app.playerManager.localBuffer.add({
				clientTimestamp: Date.now(),
				position: this.spaceShip.position,
				inputs: this.app.controls.keysPressed,
			});

		// if (this.app.currentScene.room) {
		// 	const stateInput: StateInput = {
		// 		position: this.spaceShip.position,
		// 		inputs: this.app.controls.keysPressed,
		// 		clientTimestamp: Date.now(),
		// 	};
		// 	this.app.currentScene.room.send<StateInput>('move', stateInput);
		// 	this.app.playerManager.requestBuffer.add(stateInput);
		// }
	}
}
