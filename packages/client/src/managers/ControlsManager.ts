import { StateInput } from '../../../server/src/rooms/schema/MyRoomState';
import App from '../app';

export default class ControlsManager {
	private app: App;
	public keysPressed: { [key: string]: boolean } = {
		w: false,
		a: false,
		s: false,
		d: false,
	}; // Better typing for keysPressed
	private sendInterval: NodeJS.Timeout | null = null; // Reference to the interval timer

	constructor(app: App) {
		this.app = app;
		this.addKeyEvents();
		this.startSendingInput();
	}

	private addKeyEvents() {
		// Add event listeners for keydown and keyup
		window.addEventListener('keydown', (event) => {
			this.keysPressed[event.key.toLowerCase()] = true;
		});

		window.addEventListener('keyup', (event) => {
			this.keysPressed[event.key.toLowerCase()] = false;
		});
	}

	private startSendingInput() {
		this.sendInterval = setInterval(() => {
			this.sendKeyStateToServer();
		}, 50);
	}

	private sendKeyStateToServer() {
		// Send the current keys pressed to the server
		if (this.app.currentScene.room) {
			this.app.currentScene.room.send<StateInput>('move', {
				inputs: this.keysPressed,
				timestamp: Date.now(),
			});
		}
	}

	// Optionally, clean up when this manager is no longer needed
	public cleanup() {
		if (this.sendInterval) {
			clearInterval(this.sendInterval);
		}
	}
}
