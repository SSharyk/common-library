import {EventEmitter, Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {HttpHelpers} from '../utils/HttpHelpers';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';


@Injectable()
export class UserService extends HttpHelpers {
	private _allUsersUrl: string = "user";
	private _specificUserUrl: string = "user/";

	constructor(private http: Http) {
    	super(http);
    }

    loadUsers() {
    	return this.getaction(this._allUsersUrl);
    }

    getUser(id: string) {
        return this.getaction(this._specificUserUrl + id);
    }
}