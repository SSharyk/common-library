import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { UserModel } from '../../../models/UserModel';

@Component({
    selector: 'user-data',
    templateUrl: './app/components/profile/user-data/userData.component.html',
    styleUrls: [ '../../../../stylesheets/popup-styles.css',
                 './app/components/profile/user-data/userData.component.css'],
})
export class UserDataComponent{
    @Input() public user: UserModel;

    ngOnInit() {
    }
}