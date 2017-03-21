import { Component, OnInit, Input } from '@angular/core';
import { Control, ControlGroup, FormBuilder, Validators, FORM_DIRECTIVES  } from "@angular/common";
import { BookModel } from '../../../models/BookModel';
import { CommentModel } from '../../../models/CommentModel';
import { CommentService } from '../../../services/comment.service';

@Component({
  selector: 'book-comments-tab',
  templateUrl: `./app/components/book-details-form/comments-tab/bookCommentsTab.component.html`,
  styleUrls: [ '../../../../stylesheets/book-styles.css',
               '../../../../stylesheets/modal-form-styles.css',
               './app/components/book-details-form/comments-tab/bookCommentsTab.component.css'],
  providers: [ CommentService, FormBuilder ],
  directives: [FORM_DIRECTIVES]
})
export class BookCommentsTabComponent implements OnInit {
  DOMAIN: String = "http://localhost:4242";
  private _commentForm: ControlGroup;
  private CommentControl:Control;


  @Input()
  public book : BookModel;
  private comments: CommentModel[];

  ngOnInit(){
  	this.loadComments();

    this.CommentControl = new Control('', Validators.required);
    this._commentForm = this._formBuilder.group({
      Comment: this.CommentControl
    });
  }

  constructor(private _formBuilder: FormBuilder,
              private _commentService: CommentService){
  	this.comments = [];
  }

  loadComments(){
  	this._commentService.loadComments(this.book.Id).subscribe((result) => {
  		var resp = JSON.parse(result["_body"]);
        resp.forEach( (item, i, array) => {
        	this.getCommentsFromResponse(item)
        	if (i == array.length)
        		this.comments = this.comments.sort(CommentModel.Sorting);
        });
  	},
  	(err) => {
  		console.error(err);
  	});
  }

  getCommentsFromResponse(item){
  	var comm: CommentModel = new CommentModel(item["_id"], item["text"], item["parentId"], item["userLogin"]);
  	this.comments.push(comm);
  }

  sendComment() {
    if (this._commentForm.valid) {
      let text = this.CommentControl.value;
      this._commentService.createComment(this.book.Id, text).subscribe(
        (resp) => this.commentAddedSuccess(resp),
        (err)  => this.commentAddedFailed(err)
      );
    }
  }

  commentAddedSuccess(resp) {
    var item = JSON.parse(resp["_body"]);
    this.getCommentsFromResponse(item);
    (document.getElementById("commentTextField") as HTMLInputElement).value = '';
  }

  commentAddedFailed(err) {
    console.error(err);
  }
}