import {EventEmitter, Injectable} from '@angular/core';
import {BookModel} from '../models/BookModel';
import {Http} from '@angular/http';
import {HttpHelpers} from '../utils/HttpHelpers';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';


@Injectable()
export class MessagesService extends HttpHelpers {
	private _allBookMessagesUrl: string = "book/{B}/messages/{U}";
	private _createMessageUrl: string = "book/{B}/messages/{U}";

	constructor(private http: Http) {
    	super(http);
    }

    loadMessages(id: Number) {
        let userLogin = JSON.parse(localStorage.getItem("CURRENT_USER_KEY"))["Login"];
    	return this.getaction(this._allBookMessagesUrl.replace("{B}", String(id)).replace("{U}", userLogin) );
    }

    createMessage(id:Number, text: string, toUserLogin: String) {
    	/// TODO: validation
    	let userLogin = JSON.parse(localStorage.getItem("CURRENT_USER_KEY"))["Login"];
    	let message = {
    		text: text,
    		bookId: id,
            fromUserLogin: userLogin,
            toUserLogin: toUserLogin
    	};
    	return this.http.post(this._createMessageUrl.replace("{B}", String(id)).replace("{U}", userLogin), message)
    		.map(res => { return res; });
    }
}