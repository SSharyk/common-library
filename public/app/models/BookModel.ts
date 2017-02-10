import { AuthorModel } from './AuthorModel';
export class BookModel{
	public Id: any;
	public Title: String;
	public Author: String; //AuthorModel;
	public User: String;

	public constructor(obj: any) {
		this.Id = obj._id;
		this.Title = obj.title;
		this.Author =  obj.authorId //new AuthorModel(obj.author);
		this.User = obj.holderId; //.login;
	}
}