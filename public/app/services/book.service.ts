import {EventEmitter, Injectable} from '@angular/core';
import {BookModel} from '../models/BookModel';
import {Http, Headers} from '@angular/http';
import {HttpHelpers} from '../utils/HttpHelpers';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';


@Injectable()
export class BookService extends HttpHelpers {
	private _allBooksUrl: string = "book";
    private _allUserBooksUrl: string = "book/ofUser/";
    private _createBookUrl: string = "book";
    private _deleteBookUrl: string = "book/";
    private _updateBookUrl: string = "book/";
	private _specificBookUrl: string = "book/";

	constructor(private http: Http) {
    	super(http);
    }

    loadBooks() {
        return this.getaction(this._allBooksUrl);
    }

    loadUserBooks() {
        let user = JSON.parse(localStorage.getItem("CURRENT_USER_KEY"));
        return this.getaction(this._allUserBooksUrl + user["Login"]);
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

    deleteBook(book: BookModel) {
        return this.deleteaction(this._deleteBookUrl + book.Id);
    }

    updateBook(book: BookModel) {
        this.deleteaction(this._deleteBookUrl + book.Id);
        return this.createBook(book);
    }
}