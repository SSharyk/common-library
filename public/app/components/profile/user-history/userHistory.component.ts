import { Component, OnInit, EventEmitter } from '@angular/core';
import { BookService } from '../../../services/book.service';
import { HistoryService } from '../../../services/history.service';
import { HistoryModel } from '../../../models/HistoryModel';

@Component({
  selector: 'user-history',
  templateUrl: `./app/components/profile/user-history/userHistory.component.html`,
  styleUrls: [  '../../../../stylesheets/modal-form-styles.css',
                './app/components/profile/user-history/userHistory.component.css'],
  providers: [BookService, HistoryService]
})
export class UserHistoryComponent implements OnInit {
    private _history: HistoryModel[];
    private MY_LOGIN: string = "";

    ngOnInit() {
        console.log("init of History");
        this.MY_LOGIN =  (localStorage.getItem("CURRENT_USER_KEY") != null)
			? JSON.parse(localStorage.getItem("CURRENT_USER_KEY"))["Login"] : "";  
        this._historyService.getAll(this.MY_LOGIN).subscribe(
            (resp) => this.getHistorySuccess(resp),
            (err)  => this.getHistoryFailed(err)
        );
    }

    constructor(private _historyService: HistoryService,
                private _bookService: BookService) {
        this._history = [];
    }

    getHistorySuccess(resp) {
        this._history = [];
        let body = JSON.parse(resp["_body"]);
        for (var i=0; i<body.length; i++) {
            let hItem = new HistoryModel(body[i], this._bookService);
            this._history.push(hItem);
        }
    }
    	
    getHistoryFailed(err) {
        console.error(err);
    }
}