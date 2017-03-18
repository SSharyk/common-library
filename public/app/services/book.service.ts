import {EventEmitter, Injectable} from '@angular/core';
import {BookModel} from '../models/BookModel';
import {Http, Headers} from '@angular/http';
import {HttpHelpers} from '../utils/HttpHelpers';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';


@Injectable()
export class BookService extends HttpHelpers {
	private _allBooksUrl: string = "book";
    private _createBookUrl: string = "book";
	private _specificBookUrl: string = "book/";

	constructor(private http: Http) {
    	super(http);
    }

    loadBooks() {
        return this.getaction(this._allBooksUrl);
    }

    getBook(id:String) {
    	return this.getaction(this._specificBookUrl + id);
    }

    createBook(book: BookModel) {
        let user = JSON.parse(localStorage.getItem("CURRENT_USER_KEY"));
        let headers = new Headers();
        headers.append('login', user["Login"]);
    
        return this.http.post(this._createBookUrl, book, 
            {
                headers: headers
            })
        .map(res => {
                return res;
            });
    }
}