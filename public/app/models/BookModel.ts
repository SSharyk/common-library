import { AuthorModel } from './AuthorModel';
export class BookModel{
	public Id: any;
	public Title: String;
	public Author: AuthorModel;
	public User: String;

	public constructor(obj: any) {
		this.Id = obj.book._id;
		this.Title = obj.book.title;
		this.Author =  new AuthorModel(obj.author);
		this.User = obj.user.login;
	}
}