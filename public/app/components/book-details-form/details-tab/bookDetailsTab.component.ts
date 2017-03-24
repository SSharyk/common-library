import { Component, OnInit, Input } from '@angular/core';
import { BookModel } from '../../../models/BookModel';
import { UserModel } from '../../../models/UserModel';
import { UserService } from '../../../services/user.service';
import { UserDataComponent } from '../../profile/user-data/userData.component';

@Component({
  selector: 'book-details-tab',
  templateUrl: `./app/components/book-details-form/details-tab/bookDetailsTab.component.html`,
  styleUrls: [ '../../../../stylesheets/book-styles.css',
               '../../../../stylesheets/popup-styles.css',
               './app/components/book-details-form/details-tab/bookDetailsTab.component.css'],
  directives: [UserDataComponent],               
})
export class BookDetailsTabComponent implements OnInit {
  @Input()
  public book : BookModel;
  private user: UserModel;
  private IsUserSelected: Boolean;  

  DOMAIN: String = "http://localhost:4242";

  ngOnInit(){
    this._userService.getUser(this.book.User).subscribe(
            (resp) => this.userLoadedSuccess(resp),
            (err) => this.userLoadedFail(err)
        );
  }

  constructor(private _userService: UserService) {
  }
  
  toggleUserData() {
    this.IsUserSelected = !this.IsUserSelected;
  }
  
  userLoadedSuccess(resp) {
      let body = JSON.parse(resp["_body"]);
      this.user = new UserModel(body);
  }

  userLoadedFail(err) {
      console.error(err);
  }
}