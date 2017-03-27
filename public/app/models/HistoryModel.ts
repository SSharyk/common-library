import { BookService } from '../services/book.service';

export class HistoryModel{
	public Id: any;
	public FromUserLogin: string;
	public ToUserLogin: string;
	public Status: Number;
	public BookTitle: string;	
	public Date: Date;
	
	public constructor(obj: any, private _bookService: BookService) {
		this.Id = obj["_id"];
		this.FromUserLogin = obj.fromUserLogin;
		this.ToUserLogin = obj.toUserLogin;
		this.Status = obj.status;
		this.Date = obj.createdAt || new Date();
		if (obj.bookTitle != null && obj.bookTitle != undefined) 
			this.BookTitle = obj.bookTitle;
		else 
			this.loadBookTitle(obj);
	}

	getMessage(currentUserLogin): string {
		let message = "";
		if (this.Status == 1) {
			message = (this.FromUserLogin == currentUserLogin)
				? "Вы предложили книгу {B} пользователю {T}"
				: "Пользователь {F} предложил Вам книгу {B}";
		} else {
			message = (this.FromUserLogin != currentUserLogin)
				? "Вы подтвердили получение книги {B} от пользователя {F}"
				: "Пользователь {T} подтвердил получение от Вас книги {B}";
		}

		return message
				.replace("{B}", this.BookTitle)
				.replace("{F}", this.FromUserLogin)
				.replace("{T}", this.ToUserLogin);
	}

	loadBookTitle(body) {
		this._bookService.getBook(body["bookId"]).subscribe(
			(resp) => this.getBookSuccess(resp),
			(err)  => this.getBookFailed(err)
		);
	}

	getBookSuccess(resp) {
		let body = JSON.parse(resp["_body"]);
		this.BookTitle = body["book"]["title"];
	}

	getBookFailed(err) {
		console.error(err);
	}
}