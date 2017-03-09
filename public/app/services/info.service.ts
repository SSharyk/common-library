import {EventEmitter, Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {HttpHelpers} from '../utils/HttpHelpers';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';


@Injectable()
export class InfoService extends HttpHelpers {
	private _getStatistics: string = "stat";

	constructor(private http: Http) {
    	super(http);
    }

    loadStatistics() {
    	return this.getaction(this._getStatistics);
    }
}