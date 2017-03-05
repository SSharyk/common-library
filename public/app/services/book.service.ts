import {EventEmitter, Injectable} from '@angular/core';
import {BookModel} from '../models/BookModel';
import {Http} from '@angular/http';
import {HttpHelpers} from '../utils/HttpHelpers';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';


@Injectable()
export class BookService extends HttpHelpers {
	private _allBooksUrl: string = "book";
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
}