import App from '../app';

export class UiManager {
	private app: App;
	private messageBox: HTMLDivElement;

	constructor(app: App) {
		this.app = app;
		this.messageBox = document.createElement('div');
		this.messageBox.id = 'messageBox';
		document.body.append(this.messageBox);
	}

	// public setWarning(text: string) {
	// 	if (this.warning) {
	// 		this.warning.style.display = 'flex';
	// 		this.warning.innerText = text;
	// 	}
	// }

	// public unsetWarning() {
	// 	this.warning.style.display = 'none';
	// }

	public addMessage(text: string) {
		const message = document.createElement('div');
		message.innerText = text;
		this.messageBox.append(message);
	}
}
