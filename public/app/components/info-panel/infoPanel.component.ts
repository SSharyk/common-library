import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { FormsModule } from "@angular/forms";
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { InfoService } from '../../services/info.service';
import { AuthService } from '../../services/auth.service';
import { UserModel } from '../../models/UserModel';
import { ClickOutsideDirective } from '../../utils/actionByOutsideClick.directive';
var md5 = require('js-md5');


@Component({
  selector: 'info-panel',
  templateUrl: `./app/components/info-panel/infoPanel.component.html`,
  styleUrls: [  '../../../stylesheets/popup-styles.css',
                './app/components/info-panel/infoPanel.component.css'],
  providers: [InfoService, CookieService, AuthService],
  directives: [ClickOutsideDirective]
})
export class InfoPanelComponent implements OnInit {
  private books: Number;
  private users: Number;

  private loggedUser: UserModel;
  private isRegistration: Boolean;
  private isFormVisible: Boolean;
  private errorMessage: String;

  private static AUTH_COOKIE_NAME = "TICKET_AUTH"
  private static CURRENT_USER_KEY: string = "CURRENT_USER_KEY";

  ngOnInit() {
    this.loadStatistics();
    this.getCurrentUser();
  }

  constructor(private _infoService: InfoService,
              private _authService: AuthService,
              private _cookieService: CookieService,
              private _router: Router) {
    this.errorMessage = "";
  }

  loadStatistics() {
    this._infoService.loadStatistics().subscribe(
      (res) => { this.storeData(res); },
      (err) => { console.error(err); }
    );
  }

  storeData(response) {
    var body = JSON.parse(response["_body"]);
    this.books = body["books"];
    this.users = body["users"];
  }

  getCurrentUser() {
    this._authService.isValid().subscribe(
      (resp)=> this.isValidSuccess(resp),
      (err) => console.error(err)
    );
  }

  isValidSuccess(resp) {
    if (JSON.parse(resp["_body"])["ok"]) {
      this._authService.getCurrentUser().subscribe(
        (resp) => this.setCurrentUser(resp),
        (err)  => this.gettingCurrentFailed(err)
      );
    } else {
      localStorage.removeItem(InfoPanelComponent.CURRENT_USER_KEY);
      this._cookieService.remove(InfoPanelComponent.AUTH_COOKIE_NAME);
    }
  }

  setCurrentUser(resp) {
    if (resp["_body"] != undefined) {
      var body = JSON.parse(resp["_body"]);
      if (Math.floor(+body["status"]/100) != 4) {
        this.loggedUser = new UserModel(body);
      } else {
        this.loggedUser = null;
        this.errorMessage = body["message"];
        if (this.errorMessage != "Вы еще не авторизованы") 
          this.showLoginForm(this.isRegistration);
      }
    } else {
      this.loggedUser = this._authService.CurrentUser;
    }
    this._authService.setCurrentUser(this.loggedUser);
  }

  clearCurrentUser() {
    this.loggedUser = null;
    this._authService.setCurrentUser(null);
  }

  showDropDownMenu() {
    document.getElementById("accountDropdown").classList.toggle("show");
  }

  hideDropDownMenu() {
    document.getElementById("accountDropdown").classList.remove("show");
  }

  showLoginForm(isReg: Boolean) {
    this.isRegistration = isReg;
    this.isFormVisible = true;
  }
  
  hideLoginForm() {
    this.isFormVisible = false;
  }

  login() {
    this.errorMessage = "";
    let login = (document.getElementById("fieldLogin") as HTMLInputElement).value;
    let password = (document.getElementById("fieldPassword") as HTMLInputElement).value;

    this._authService.login(login, md5(password)).subscribe(
      (resp) => this.setCurrentUser(resp),
      (err)  => this.loginFailed(err)
    );
  }

  register() {
    this.errorMessage = "";
    let login = (document.getElementById("fieldLogin") as HTMLInputElement).value;
    let password = (document.getElementById("fieldPassword") as HTMLInputElement).value;
    let email = (document.getElementById("fieldEmail") as HTMLInputElement).value;
    let addresses = (document.getElementById("fieldAddresses") as HTMLInputElement).value;

    this._authService.register(login, md5(password), email, addresses).subscribe(
      (resp) => this.setCurrentUser(resp),
      (err)  => this.registerFailed(err)
    );    
  }

  logout() {
    this._authService.logout().subscribe(
      (resp) => {
        this.clearCurrentUser();
        this._router.navigate(['./']);
      },
      (err)  => this.logoutFailed(err)
    );
  }

  gettingCurrentFailed(err) {
    console.error(err);
    this.loggedUser = null;
    localStorage.removeItem(InfoPanelComponent.CURRENT_USER_KEY);
    this._authService.setCurrentUser(null);
  }

  loginFailed(err) {
    console.error(err);
    this.showLoginForm(this.isRegistration);
    this.errorMessage = JSON.parse(err["_body"])["message"];
  }

  registerFailed(err) {
    console.error(err);
    this.showLoginForm(this.isRegistration);
    this.errorMessage = JSON.parse(err["_body"])["message"];
  }

  logoutFailed(err) {
    console.error(err);
    this.loggedUser = null;
  }

  toMain() {
    this._router.navigate(['./']);
  }
  
  showMyBooks() {
    this._router.navigate(['./my']);
  }

  showHistory() {
    this._router.navigate(['./histories']);
  }
}
