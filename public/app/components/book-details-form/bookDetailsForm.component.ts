import { Component, OnInit, Input } from '@angular/core';
import { BookModel } from '../../models/BookModel';
import { BookDetailsTabComponent } from './details-tab/bookDetailsTab.component';

@Component({
  selector: 'book-details-form',
  templateUrl: `./app/components/book-details-form/bookDetailsForm.component.html`,
  styleUrls: ['../../../stylesheets/bootstrap.min.css',
              './app/components/book-details-form/bookDetailsForm.component.css'],
  directives: [BookDetailsTabComponent],
})
export class BookDetailsFormComponent implements OnInit {
  @Input()
  public book : BookModel;

  private visibility: Boolean[];
  private selectedTab: number;

  ngOnInit(){
    this.selectedTab = 0;
    this.visibility = new Array(3);
    this.visibility.forEach((val, ind, arr) => {
      arr[ind] = false;
    });
    this.showTab(0);
  }

  showTab(tabIndex: number) {
    this.visibility[this.selectedTab] = false;
    this.selectedTab = tabIndex;
    this.visibility[this.selectedTab] = true;
  }
}
