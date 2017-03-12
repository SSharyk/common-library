import { AuthorModel } from './AuthorModel';
export class BookModel{
	public Id: any;
	public Title: String;
	public Description: String;	
	public Authors: AuthorModel[];
	public Year: Number;
	public Pages: Number;
	public User: String;

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
	}
}