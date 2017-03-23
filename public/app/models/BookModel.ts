import { AuthorModel } from './AuthorModel';
import { MessageModel } from './MessageModel';
export class BookModel{
	public Id: any;
	public Title: String;
	public Description: String;	
	public Authors: AuthorModel[];
	public Year: Number;
	public Pages: Number;
	public User: String;
	public Messages: MessageModel[];
	private _users: String[];

	public constructor(obj: any) {
		this.Id = obj.book._id;
		this.Title = obj.book.title;
		this.Description = obj.book.description;
		this.Authors = [];
		for (var i=0; i<obj.book.authors.length; i++)
			this.Authors.push(new AuthorModel(obj.book.authors[i]));
		this.Year = obj.book.year;
		this.Pages = obj.book.pages;
		this.User = obj.user.login;
		this.Messages = [];
		this._users = [];
		this._pushMessagesToConversations(obj.messages);
	}

	private _pushMessagesToConversations(messages) {
		let currentUser = (localStorage.getItem("CURRENT_USER_KEY") != null)
			? JSON.parse(localStorage.getItem("CURRENT_USER_KEY"))["Login"] : "";
		for (var i=0; i<messages.length; i++) {
			let fromUserLogin = messages[i]["fromUserLogin"];
			let toUserLogin = messages[i]["toUserLogin"];

			if (fromUserLogin != currentUser && toUserLogin != currentUser)
				continue;

			let author = (toUserLogin == currentUser) ? fromUserLogin : toUserLogin;
			let index = this._users.indexOf(author);
			if (index == -1) {
				this._users.push(author);
				this.Messages.push(new MessageModel());
				index = this.Messages.length - 1;
			}
			this.Messages[index].addMessage(fromUserLogin, toUserLogin, messages[i]["text"]);
		}
	}

	public addMessage(mess: MessageModel) {
		let currentUser = (localStorage.getItem("CURRENT_USER_KEY") != null)
			? JSON.parse(localStorage.getItem("CURRENT_USER_KEY"))["Login"] : "";
		let fromUserLogin = mess.FromUserLogin[0];
		let toUserLogin = mess.ToUserLogin[0];

		let author = (toUserLogin == currentUser) ? fromUserLogin : toUserLogin;
		let index = this._users.indexOf(author);
		if (index == -1) {
			this._users.push(author);
			this.Messages.push(new MessageModel());
			index = this.Messages.length - 1;
		}
		this.Messages[index].addMessage(fromUserLogin, toUserLogin, mess.Text[0]);			
	}
}