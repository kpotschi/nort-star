import App from '../app';

export class UiManager {
	private app: App;
	private warning: HTMLDivElement;

	constructor(app: App) {
		this.app = app;
		this.warning = document.createElement('div');
		this.warning.style.display = 'none';
		this.warning.id = 'warning';
		document.body.append(this.warning);
	}

	public setWarning(text: string) {
		if (this.warning) {
			this.warning.style.display = 'flex';
			this.warning.innerText = text;
		}
	}

	public unsetWarning() {
		this.warning.style.display = 'none';
	}
}
