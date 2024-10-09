import App from '../app';

export default class ControlsManager {
	public app: App;
	public keysPressed: { [key: string]: boolean };

	constructor(app: App) {
		this.app = app;

		// Set up the proxy to listen for changes to keysPressed
		this.keysPressed = new Proxy<{ [key: string]: boolean }>(
			{ w: false, a: false, s: false, d: false },
			{
				set: (target, key: string, value: boolean) => {
					if (target[key] !== value) {
						target[key] = value;
					}
					return true;
				},
			}
		);

		this.addKeyEvents();
	}

	private addKeyEvents() {
		window.addEventListener('keydown', (event) => {
			this.keysPressed[event.key.toLowerCase()] = true;
		});

		window.addEventListener('keyup', (event) => {
			this.keysPressed[event.key.toLowerCase()] = false;
		});
	}
}

// private startSendingInput() {
// 	this.sendInterval = setInterval(() => {
// 		this.sendKeyStateToServer();
// 	}, 50);
// }

// private sendKeyStateToServer() {
// 	if (this.app.currentScene.room) {
// 		const stateInput: StateInput = {
// 			inputs: this.keysPressed,
// 			clientTimestamp: Date.now(),
// 		};
// 		this.app.currentScene.room.send<StateInput>('move', stateInput);
// 		this.app.playerManager.requestBuffer.add(stateInput);
// 	}
// }

// public cleanup() {
// 	if (this.sendInterval) {
// 		clearInterval(this.sendInterval);
// 	}
// }
