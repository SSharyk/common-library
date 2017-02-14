import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'all-users',
  templateUrl: `./app/components/users/users.component.html`,
  styleUrls: ['./app/components/users/users.component.css'],
  providers: [UserService]
})
export class UsersComponent implements OnInit {
	title = 'The list of users in the system';
	private users: string[];

	ngOnInit() {
		this.loadUsers();
	}
	constructor (private userService: UserService) {
		this.users = [];
	}

	loadUsers() {
		this.userService.loadUsers().subscribe(
            (result) => { 
              var resp = JSON.parse(result["_body"]);
              resp.forEach( (item, i, array) => this.onUserLoaded(item) );
            },
            (error) => {
            	console.error(error);
            }
        );
  }

  onUserLoaded(item) {
    this.users.push(item.login);
  }
}