import {EventEmitter, Injectable} from '@angular/core';
import {BookModel} from '../models/BookModel';
import {Http} from '@angular/http';
import {HttpHelpers} from '../utils/HttpHelpers';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';


@Injectable()
export class CommentService extends HttpHelpers {
	private _allBookCommentsUrl: string = "book/_/comments";

	constructor(private http: Http) {
    	super(http);
    }

    loadComments(id: Number) {
    	return this.getaction(this._allBookCommentsUrl.replace("_", String(id)));
    }
}