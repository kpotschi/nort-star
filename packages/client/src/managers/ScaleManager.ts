import App from '../app';

export default class ScaleManager {
	private app: App;
	constructor(app: App) {
		this.app = app;
		this.setupResizeListener();
	}

	private setupResizeListener() {
		window.addEventListener('resize', () => {
			this.app.renderer.setSize(window.innerWidth, window.innerHeight);
			this.app.renderer.composer.setSize(window.innerWidth, window.innerHeight);

			this.app.camera.aspect = window.innerWidth / window.innerHeight;
			this.app.camera.updateProjectionMatrix();
		});
	}
}
