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
						this.app.client.queueServerUpdate(); // Only update when the key state changes
					}
					return true;
				},
			}
		);

		this.addKeyEvents();
	}

	private addKeyEvents() {
		window.addEventListener('keydown', (event) => {
			const key = event.key.toLowerCase();
			if (!this.keysPressed[key]) this.keysPressed[key] = true;
		});

		window.addEventListener('keyup', (event) => {
			const key = event.key.toLowerCase();
			if (this.keysPressed[key]) this.keysPressed[key] = false;
		});
	}
}
