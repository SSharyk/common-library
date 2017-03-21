import { Component, OnInit, Input } from '@angular/core';
import { Control, ControlGroup, FormBuilder, Validators, FORM_DIRECTIVES  } from "@angular/common";
import { BookModel } from '../../models/BookModel';
import { CommentModel } from '../../models/CommentModel';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'book-dialog-form',
  templateUrl: `./app/components/book-dialog/bookDialog.component.html`,
  styleUrls: [ '../../../../stylesheets/book-styles.css',
               '../../../../stylesheets/modal-form-styles.css',  
               './app/components/book-dialog/bookDialog.component.css'],
  providers: [ MessagesService, FormBuilder ],
  directives: [FORM_DIRECTIVES]
})
export class BookDialogComponent implements OnInit {
  DOMAIN: String = "http://localhost:4242";
  private _messageForm: ControlGroup;
  private MessageControl:Control;


  @Input() public book : BookModel;
  @Input() public title: String;
  private messages: CommentModel[];
  private MY_LOGIN: String = JSON.parse(localStorage.getItem("CURRENT_USER_KEY"))["Login"];

  ngOnInit(){
    this.loadMessages();

    this.MessageControl = new Control('', Validators.required);
    this._messageForm = this._formBuilder.group({
      Message: this.MessageControl
    });
  }

  constructor(private _formBuilder: FormBuilder,
              private _messagesService: MessagesService){
    this.messages = [];
  }

  loadMessages(){
    this._messagesService.loadMessages(this.book.Id).subscribe((result) => {
      var resp = JSON.parse(result["_body"]);
        resp.forEach( (item, i, array) => {
          this.getMessagesFromResponse(item)
          if (i == array.length)
            this.messages = this.messages.sort(CommentModel.Sorting);
        });
    },
    (err) => {
      console.error(err);
    });
  }

  getMessagesFromResponse(item){
    var comm: CommentModel = new CommentModel(item["_id"], item["text"], item["parentId"], item["userLogin"]);
    this.messages.push(comm);
  }

  sendMessage() {
    if (this._messageForm.valid) {
      let text = this.MessageControl.value;
      this._messagesService.createMessage(this.book.Id, text, this.book.User).subscribe(
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
}