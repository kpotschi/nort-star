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
						this.updateInput(); // Only update when the key state changes
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
			if (!this.keysPressed[key]) {
				// Only update if the key wasn't already pressed
				this.keysPressed[key] = true;
			}
		});

		window.addEventListener('keyup', (event) => {
			const key = event.key.toLowerCase();
			if (this.keysPressed[key]) {
				// Only update if the key was pressed before
				this.keysPressed[key] = false;
			}
		});
	}

	public updateInput() {
		const self = this.app.playerManager.self;

		if (self) {
			self.velocity.set(0, 0, self.velocity.z);

			if (this.app.controls.keysPressed['w']) {
				self.velocity.y += 1; // Forward
			}
			if (this.app.controls.keysPressed['s']) {
				self.velocity.y -= 1; // Backward
			}
			if (this.app.controls.keysPressed['d']) {
				self.velocity.x -= 1; // Left
			}
			if (this.app.controls.keysPressed['a']) {
				self.velocity.x += 1; // Right
			}

			// Normalize to prevent faster diagonal movement
			const length = Math.sqrt(
				self.velocity.x * self.velocity.x + self.velocity.y * self.velocity.y
			);
			if (length > 0) {
				self.velocity.x /= length;
				self.velocity.y /= length;
			}

			this.app.currentScene.sendServerUpdate();
		}
	}
}
