import { Component, OnInit, Input } from '@angular/core';
import { BookModel } from '../../models/BookModel';

@Component({
  selector: 'book-item',
  templateUrl: `./app/components/book-item/bookItem.component.html`,
  styleUrls: ['./app/components/book-item/bookItem.component.css'],
})
export class BookItemComponent implements OnInit {
  MAX_LENGTH: Number = 100;

  @Input()
  public book : BookModel;

  private get ShortDescription(): String {
    var d = this.book.Description;
    return (d.length > this.MAX_LENGTH) ? d.substr(0, +this.MAX_LENGTH) + "..." : d;
  }
  ngOnInit(){
    /// TODO: load
    //this.loadComments(this.book.Id);
  }
}
