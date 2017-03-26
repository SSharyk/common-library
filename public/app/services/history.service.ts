import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {HttpHelpers} from '../utils/HttpHelpers';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';


@Injectable()
export class HistoryService extends HttpHelpers {
    private _getBookHistoryUrl: string = "history/get?id={ID}&from={F}";
    private _getUserHistoryUrl: string = "history/ofUser/";
	private _transferBookUrl: string = "history/transfer?id={ID}&from={F}&to={T}&status={S}";

	constructor(private http: Http) {
    	super(http);
    }

    find(bookId, fromLogin) {
        let url = this._getBookHistoryUrl
                        .replace("{ID}", bookId)
                        .replace("{F}", fromLogin);
        return this.getaction(url);
    }

    getAll(userLogin) {
        return this.getaction(this._getUserHistoryUrl + userLogin);
    }

    transferBook(bookId, from, to) {
        let url = this._transferBookUrl
                        .replace("{ID}", bookId)
                        .replace("{F}", from)
                        .replace("{T}", to)
                        .replace("{S}", "1");
    	return this.getaction(url);
    }

    confirmBook(bookId, from, to) {
        let url = this._transferBookUrl
                        .replace("{ID}", bookId)
                        .replace("{F}", from)
                        .replace("{T}", to)
                        .replace("{S}", "2");
    	return this.getaction(url);
    }
}