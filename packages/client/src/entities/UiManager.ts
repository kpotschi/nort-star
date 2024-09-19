import App from '../app';

export class UiManager {
	private app: App;
	private overlay: HTMLDivElement;
	constructor(app: App) {
		this.app = app;
	}
}
