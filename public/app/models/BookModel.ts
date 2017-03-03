import { AuthorModel } from './AuthorModel';
export class BookModel{
	public Id: any;
	public Title: String;
	public Description: String;	
	/// TODO: not the only author, but list
	public Author: AuthorModel;
	public Year: Number;
	public Pages: Number;
	public User: String;

	public constructor(obj: any) {
		this.Id = obj.book._id;
		this.Title = obj.book.title;
		this.Description = obj.book.description;
		this.Author =  new AuthorModel(obj.book.author);
		this.Year = obj.book.year;
		this.Pages = obj.book.pages;
		this.User = obj.user.login;
	}
}