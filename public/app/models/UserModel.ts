export class UserModel {
	public Login: String;
	public Email: String;
	public Addresses: String[];

	constructor(user: UserModel);
	constructor(user: any) {
		this.Login = user && user["login"] || user["Login"];
		this.Email = user && user["email"] || user["Email"];
		this.Addresses = user && user["addresses"] || user["Addresses"];
	}
}