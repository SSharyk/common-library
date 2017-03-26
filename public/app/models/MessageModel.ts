export class MessageModel {
	public FromUserLogin: String[];
	public ToUserLogin: String[];
	public Text: String[];

	constructor() {
		this.FromUserLogin = [];
		this.ToUserLogin = [];
		this.Text = [];
	}

	addMessage(fromUser: String, toUser: String, text: String) {
		this.FromUserLogin.push(fromUser);
		this.ToUserLogin.push(toUser);
		this.Text.push(text);
	}

	getLastMessageText() {
		return this.Text[this.Text.length - 1];
	}

	getLastMessageAuthor() {
		return this.FromUserLogin[this.FromUserLogin.length - 1];
	}
}