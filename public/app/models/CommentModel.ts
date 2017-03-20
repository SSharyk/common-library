export class CommentModel {
	public Parent: CommentModel;
	public Children: CommentModel[];

	public constructor(public Id: any, public Text: String, public ParentId: Number, public User: String) {
		this.Children = [];
	}

	static Sorting(lhs: CommentModel, rhs: CommentModel) {
		if (+lhs.Id < +rhs.Id) return -1;
		if (+lhs.Id == +rhs.Id) return 0;
		return 1;
	}
}