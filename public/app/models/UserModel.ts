export class UserModel {
	public Login: String;
	public Email: String;
	public Addresses: String[];

	constructor(user: UserModel);
	constructor(user: any) {
		this.Login = user && user["login"] || user["Login"];
		this.Email = user && user["email"] || user["Email"];
		this.Addresses = this.getAddresses(user);
	}

	getAddresses(user) {
		let array = user && user["addresses"] || user["address"] || user["Addresses"];
		let addresses = [];
		for (var i=0; i<array.length; i++) {
			let town = array[i]["town"] || '';
			let street = array[i]["street"] || '';
			addresses.push(town + " " + street);
		}
		return addresses;
	}
}