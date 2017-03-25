export class HistoryModel{
	public Id: any;
	public FromUserLogin: String;
	public ToUserLogin: String;
	public Status: Number;
	
	public constructor(obj: any) {
		this.Id = obj["_id"];
		this.FromUserLogin = obj.fromUserLogin;
		this.ToUserLogin = obj.toUserLogin;
		this.Status = obj.status;
	}
}