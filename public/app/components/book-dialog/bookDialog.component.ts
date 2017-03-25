import { Component, OnInit, Input } from '@angular/core';
import { Control, ControlGroup, FormBuilder, Validators, FORM_DIRECTIVES  } from "@angular/common";
import { BookModel } from '../../models/BookModel';
import { MessageModel } from '../../models/MessageModel';
import { UserModel } from '../../models/UserModel';
import { UserService } from '../../services/user.service';
import { HistoryService } from '../../services/history.service';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'book-dialog-form',
  templateUrl: `./app/components/book-dialog/bookDialog.component.html`,
  styleUrls: [ '../../../stylesheets/popup.css',  
               '../../../stylesheets/book-styles.css',  
               '../../../stylesheets/modal-form-styles.css',
               './app/components/book-dialog/bookDialog.component.css'],
  providers: [ MessagesService, FormBuilder, HistoryService ],
  directives: [FORM_DIRECTIVES]
})
export class BookDialogComponent implements OnInit {
  DOMAIN: String = "http://localhost:4242";
  private _messageForm: ControlGroup;
  private MessageControl:Control;

  @Input() public DialogIndex: number = 0;
  @Input() public isPrivateTab: Boolean = false;
  @Input() public book : BookModel;
  @Input() public title: String;
  private messages: MessageModel[];
  private MY_LOGIN: String;
  private selectedUser: UserModel = null;

  ngOnInit(){
    this.MY_LOGIN = (localStorage.getItem("CURRENT_USER_KEY") != null)
			? JSON.parse(localStorage.getItem("CURRENT_USER_KEY"))["Login"] : "";    
    this.messages = this.book.Messages.filter(this._filtering);
    if (this.isPrivateTab && this.messages.length > 0)
      if (this.messages[0].FromUserLogin.length > 0 && this.messages[0].FromUserLogin[0] == undefined) {
        this.loadMessages();
      } 
    this.MessageControl = new Control('', Validators.required);
    this._messageForm = this._formBuilder.group({
      Message: this.MessageControl
    });
  }

  constructor(private _formBuilder: FormBuilder,
              private _messagesService: MessagesService,
              private _userService: UserService){
    this.messages = [];    
  }

  loadMessages(){
    this._messagesService.loadMessages(this.book.Id).subscribe((result) => {
      var resp = JSON.parse(result["_body"]);
        resp.forEach( (item, i, array) => {
          this.getMessagesFromResponse(item);
        });
    },
    (err) => {
      console.error(err);
    });
  }

  getMessagesFromResponse(item){
    var m: MessageModel = new MessageModel();
    m.addMessage(item["fromUserLogin"], item["toUserLogin"], item["text"]);
    this.messages.push(m);
    if (!this.isPrivateTab)
      this.book.addMessage(m);
    else
      this.book.Messages[this.DialogIndex].addMessage(item["fromUserLogin"], item["toUserLogin"], item["text"]);
  }

  sendMessage() {
    if (this._messageForm.valid) {
      let text = this.MessageControl.value;
      let toUser = (this.isPrivateTab) 
        ? this.book.Messages[this.DialogIndex].FromUserLogin[0] 
        : this.book.User;
      this._messagesService.createMessage(this.book.Id, text, toUser).subscribe(
        (resp) => this.messageAddedSuccess(resp),
        (err)  => this.messageAddedFailed(err)
      );
    }
  }

  messageAddedSuccess(resp) {
    var item = JSON.parse(resp["_body"]);
    this.getMessagesFromResponse(item);
    (document.getElementById("messageTextField") as HTMLInputElement).value = '';
  }

  messageAddedFailed(err) {
    console.error(err);
  }

  private _filtering(item: MessageModel, index, array) {
    let my = (localStorage.getItem("CURRENT_USER_KEY") != null)
			? JSON.parse(localStorage.getItem("CURRENT_USER_KEY"))["Login"] : "";   
    return (item.FromUserLogin.indexOf(my) != -1 ||
            item.ToUserLogin.indexOf(my) != -1);
  }

  toggleUserData(userLogin) {
    if (this.selectedUser == null || this.selectedUser.Login != userLogin) {
      this._userService.getUser(userLogin).subscribe(
          (resp) => this.userLoadedSuccess(resp),
          (err) => this.userLoadedFail(err)
      );
    } else {
      this.selectedUser = null;
    }
  }

  userLoadedSuccess(resp) {
      let body = JSON.parse(resp["_body"]);
      this.selectedUser = new UserModel(body);
  }

  userLoadedFail(err) {
      console.error(err);
  }
}