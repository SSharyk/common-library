import {EventEmitter, Injectable} from '@angular/core';
import {BookModel} from '../models/BookModel';
import {Http} from '@angular/http';
import {HttpHelpers} from '../utils/HttpHelpers';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';


@Injectable()
export class BookService extends HttpHelpers {
	private _allBooksUrl: string = "http://localhost:4242/book";

	constructor(private http: Http) {
    	super(http);
    }

    loadBooks() {
        return this.getaction(this._allBooksUrl);
    }
}