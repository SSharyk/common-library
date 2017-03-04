import { Component, OnInit, Input } from '@angular/core';
import { BookModel } from '../../../models/BookModel';
import { CommentModel } from '../../../models/CommentModel';
import { CommentService } from '../../../services/comment.service';

@Component({
  selector: 'book-comments-tab',
  templateUrl: `./app/components/book-details-form/comments-tab/bookCommentsTab.component.html`,
  styleUrls: [ '../../../../stylesheets/book-styles.css',
               './app/components/book-details-form/comments-tab/bookCommentsTab.component.css'],
  providers: [ CommentService ]
})
export class BookCommentsTabComponent implements OnInit {
  @Input()
  public book : BookModel;
  private comments: CommentModel[];

  ngOnInit(){
  	this.loadComments();
  }

  constructor(private _commentServce: CommentService){
  	this.comments = [];
  }

  loadComments(){
  	this._commentServce.loadComments(this.book.Id).subscribe((result) => {
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
  	var comm: CommentModel = new CommentModel(item["_id"], item["text"], item["parentId"]);
  	this.comments.push(comm);
  }
}