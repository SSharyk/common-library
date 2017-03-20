import {EventEmitter, Injectable} from '@angular/core';
import {BookModel} from '../models/BookModel';
import {Http} from '@angular/http';
import {HttpHelpers} from '../utils/HttpHelpers';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';


@Injectable()
export class CommentService extends HttpHelpers {
	private _allBookCommentsUrl: string = "book/_/comments";
	private _createCommentUrl: string = "book/_/comments";

	constructor(private http: Http) {
    	super(http);
    }

    loadComments(id: Number) {
    	return this.getaction(this._allBookCommentsUrl.replace("_", String(id)));
    }

    createComment(id:Number, text: string, parentId: Number = null) {
    	/// TODO: validation
    	let userLogin = JSON.parse(localStorage.getItem("CURRENT_USER_KEY"))["Login"];
    	let comment = {
    		text: text,
    		bookId: id,
    		parentId: parentId,
    		userLogin: userLogin
    	};
    	return this.http.post(this._createCommentUrl.replace("_", String(id)), comment)
    		.map(res => { return res; });
    }
}