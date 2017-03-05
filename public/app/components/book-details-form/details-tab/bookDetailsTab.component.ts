import { Component, OnInit, Input } from '@angular/core';
import { BookModel } from '../../../models/BookModel';

@Component({
  selector: 'book-details-tab',
  templateUrl: `./app/components/book-details-form/details-tab/bookDetailsTab.component.html`,
  styleUrls: [ '../../../../stylesheets/book-styles.css',
               './app/components/book-details-form/details-tab/bookDetailsTab.component.css'],
})
export class BookDetailsTabComponent implements OnInit {
  @Input()
  public book : BookModel;

  DOMAIN: String = "http://localhost:4242";

  ngOnInit(){
  }
}