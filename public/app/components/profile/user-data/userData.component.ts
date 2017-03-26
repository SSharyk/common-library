import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { UserModel } from '../../../models/UserModel';
import { BookModel } from '../../../models/BookModel';
import { HistoryModel } from '../../../models/HistoryModel';
import { HistoryService } from '../../../services/history.service';
import { BookService } from '../../../services/book.service';

@Component({
    selector: 'user-data',
    templateUrl: './app/components/profile/user-data/userData.component.html',
    styleUrls: [ '../../../../stylesheets/popup-styles.css',
                 './app/components/profile/user-data/userData.component.css'],
    providers: [HistoryService],
})
export class UserDataComponent{
    @Input() public user: UserModel;
    @Input() public book: BookModel;
    private MY_LOGIN: string;
    private lastHistory: HistoryModel;
    private isMayBeTransferred: boolean;
    private isMayBeConfirmed: boolean;

    ngOnInit() {
        this.isMayBeTransferred = this.user.Login != this.MY_LOGIN && 
                                  this.book.User == this.MY_LOGIN;
        this._historyService.find(this.book.Id, this.book.User).subscribe(
            (resp) => this.getHistorySuccess(resp),
            (err)  => this.getHistoryFailed(err)
        );
    }

    constructor(private _historyService: HistoryService,
                private _bookService: BookService) {
        this.MY_LOGIN = (localStorage.getItem("CURRENT_USER_KEY") != null)
		    ? JSON.parse(localStorage.getItem("CURRENT_USER_KEY"))["Login"] : "";
    }

    transferBook() {
        if (this.user.Login != this.MY_LOGIN) {
            this._historyService.transferBook(this.book.Id, this.MY_LOGIN, this.user.Login).subscribe(
                (resp) => this.transferSuccess(resp),
                (err)  => this.transferFailed(err)
            );
        }
    }

    transferSuccess(resp) {
        this.isMayBeTransferred = false;
        this.isMayBeConfirmed = false;
    }

    transferFailed(err) {
        console.error(err);
    }

    getHistorySuccess(resp) {
        let body = JSON.parse(resp["_body"]);
        if (body == undefined || body.length == 0) {
            this.lastHistory = null;
            this.isMayBeConfirmed = false;
            return;
        }

        this.lastHistory = new HistoryModel(body[body.length - 1], this._bookService);

        this.isMayBeTransferred = 
                this.isMayBeTransferred && 
                this.lastHistory.Status == 2;
        this.isMayBeConfirmed = 
                this.lastHistory.FromUserLogin == this.book.User &&
                this.lastHistory.FromUserLogin == this.user.Login &&
                this.lastHistory.Status == 1;
    }

    getHistoryFailed(err) {
        console.error(err);
    }

    confirmBook() {
        this._historyService.confirmBook(this.book.Id, this.lastHistory.FromUserLogin, this.lastHistory.ToUserLogin).subscribe(
            (resp) => this.confirmationSuccess(resp),
            (err)  => this.confirmationFailed(err)
        );
    }

    confirmationSuccess(resp) {
        this._bookService.deleteBook(this.book).subscribe(
            (resp) => this.bookDeletedSuccess(resp),
            (err)  => this.bookUpdateFailed(err)
        );

        this.isMayBeConfirmed = false;
        this.isMayBeTransferred = false;
    }

    bookDeletedSuccess(resp) {

        this.book.User = this.MY_LOGIN;
        this._bookService.createBook(this.book).subscribe(
            (resp) => this.bookCreatedSuccess(resp),
            (err)  => this.bookUpdateFailed(err)
        );
    }

     bookCreatedSuccess(resp) {
         let body = JSON.parse(resp["_body"]);
         this.book = new BookModel(body);
     }

    bookUpdateFailed(err) {
        console.error(err);
    }

    confirmationFailed(err) {
        console.error(err);
        alert("При попытке подтверждения произошла ошибка. Пожалуйста, повторите попытку позднее");
    }
}