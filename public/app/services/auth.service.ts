import {EventEmitter, Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {HttpHelpers} from '../utils/HttpHelpers';
import {Observable} from 'rxjs/Observable';
import { UserModel } from '../models/UserModel';
import 'rxjs/Rx';


@Injectable()
export class AuthService extends HttpHelpers {
    private _currentUser: UserModel;
    public get CurrentUser() : UserModel {
        return this._currentUser;
    }

    private static CURRENT_USER_KEY: string = "CURRENT_USER_KEY";

	private _getCurrentUserUrl: string = "auth/current/";
	private _loginUrl: string = "auth/login/{L}/{P}";
    private _registerUrl: string = "auth/register/{L}/{P}/{E}";
    private _logoutUrl: string = "auth/logout";

	constructor(private http: Http) {
    	super(http);
    }

    getCurrentUser() {
        console.log(this._currentUser);
        if (localStorage.getItem(AuthService.CURRENT_USER_KEY) != null)
            this._currentUser = new UserModel(JSON.parse(localStorage.getItem(AuthService.CURRENT_USER_KEY)));
        else 
            this._currentUser = null;
        console.log(this._currentUser);

        if (this._currentUser != undefined && this._currentUser != null) {
             return Observable.create(observer => {
                observer.next(this._currentUser);
                observer.complete();
            })
        }
        return this.getaction(this._getCurrentUserUrl);
    }

    setCurrentUser(user: UserModel) {
        this._currentUser = user;
        console.log(this._currentUser);

        if (user != null)
            localStorage.setItem(AuthService.CURRENT_USER_KEY, JSON.stringify(this._currentUser));
        else
            localStorage.removeItem(AuthService.CURRENT_USER_KEY);
    }

    login(login: string, password: string) {
        return this.getaction(this._loginUrl.replace("{L}", login).replace("{P}", password));
    }

    register(login: string, password: string, email: string) {
        return this.getaction(this._registerUrl.replace("{L}", login).replace("{P}", password).replace("{E}", email));
    }

    logout() {
        return this.getaction(this._logoutUrl);
    }
}