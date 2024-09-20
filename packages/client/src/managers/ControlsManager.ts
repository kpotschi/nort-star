import App from '../app';

export default class ControlsManager {
	private app: App;
	public keysPressed: {} = {};

	constructor(app: App) {
		this.app = app;
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
