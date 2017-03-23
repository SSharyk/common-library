import { Component, OnInit } from '@angular/core';
import { BookModel } from '../../models/BookModel';
import { SearchModel } from '../../models/SearchModel'
import { BookService } from '../../services/book.service';
import { BookItemComponent } from '../book-item/bookItem.component';
import { BookDetailsFormComponent } from '../book-details-form/bookDetailsForm.component';
import { BookDialogComponent } from '../book-dialog/bookDialog.component';

@Component({
  selector: 'all-books',
  templateUrl: `./app/components/books/books.component.html`,
  styleUrls: [ '../../../../stylesheets/modal-form-styles.css',
               './app/components/books/books.component.css'],
  directives: [BookItemComponent, BookDetailsFormComponent, BookDialogComponent],
  providers: [BookService]
})
export class BooksComponent implements OnInit {
	title = 'Ваша общая библиотека';
	private books: BookModel[];
  private search: SearchModel;
  private IsSelected: Boolean;
  private IsDialog: Boolean;
  private SelectedBook: BookModel;
  private MY_LOGIN: string;

	ngOnInit() {
		this.loadBooks();
	}
	constructor (private bookService: BookService) {
		this.books = [];
    this.search = new SearchModel();
    this.MY_LOGIN = (localStorage.getItem("CURRENT_USER_KEY") != null)
			? JSON.parse(localStorage.getItem("CURRENT_USER_KEY"))["Login"] : "";
	}

	loadBooks() {
		this.bookService.loadBooks().subscribe(
            (result) => { 
              var resp = JSON.parse(result["_body"]);

              /// TODO: use Mongoose population
              resp.forEach( (item, i, array) => this.getBookFromResponse(item));
            },
            (error) => {
            	console.error(error);
            }
        );
	}

  getBookFromResponse(item) {
    this.bookService.getBook(item._id).subscribe(
      (resp) => {
        var res = JSON.parse(resp["_body"]);
        var book = new BookModel(res);
        this.books.push(book);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  showBookDetails(book: BookModel) {
    this.SelectedBook = book;    
    this.IsSelected = true;
    this.IsDialog = false;
  }

  closeForm() {
    if (!this.IsDialog) {
      this.IsSelected = false;
      this.SelectedBook = undefined;
    } else {
      this.IsDialog = false;
      this.IsSelected = true;
    }
  }

  showDialogForm() {
    this.IsSelected = false;
    this.IsDialog = true;    
  }
}
