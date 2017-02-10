export class AuthorModel{
	public Id: any;
	public FirstName: String;
	public LastName: String;
	get FullName(): string {
		return this.FirstName + ' ' + this.LastName;
	}

	public constructor(obj: any) {
		this.FirstName = obj.firstName;
		this.LastName = obj.lastName;
	}
}