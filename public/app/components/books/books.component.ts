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
  private pageBooks: BookModel[];
  private search: SearchModel;
  private IsSelected: Boolean;
  private IsDialog: Boolean;
  private SelectedBook: BookModel;
  private MY_LOGIN: string;
  private static BOOKS_PER_PAGE: number = 12;
  private selectedPage: number;
  private pageNumbers: number[];

	ngOnInit() {
		this.loadBooks();
	}
	constructor (private bookService: BookService) {
		this.books = [];
    this.pageBooks = [];
    this.pageNumbers = [];
    this.selectedPage = 0;
    this.search = new SearchModel();
    this.MY_LOGIN = (localStorage.getItem("CURRENT_USER_KEY") != null)
			? JSON.parse(localStorage.getItem("CURRENT_USER_KEY"))["Login"] : "";
	}

	loadBooks() {
		this.bookService.loadBooks().subscribe(
            (result) => { 
              this.books = [];
              this.pageBooks = [];
              this.pageNumbers = [];
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
        if (this.books.length > this.selectedPage*BooksComponent.BOOKS_PER_PAGE &&
            this.books.length <= (this.selectedPage+1)*BooksComponent.BOOKS_PER_PAGE) {
              this.pageBooks.push(book);
            }
        if ((this.books.length - 1) % BooksComponent.BOOKS_PER_PAGE == 0) {
          let newPageNumber = (this.pageNumbers.length == 0) 
              ? 0 : this.pageNumbers[this.pageNumbers.length - 1] + 1;
          this.pageNumbers.push(newPageNumber);
        }
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

  changePage(page=null) {
    if (page < 0) this.selectedPage = 0;
    else if (page >= this.pageNumbers.length || page==null) this.selectedPage = this.pageNumbers.length - 1;
         else this.selectedPage = page;
    console.log(this.selectedPage);

    this.pageBooks = [];
    for (var i=this.selectedPage*BooksComponent.BOOKS_PER_PAGE; 
         i<this.books.length && i<(this.selectedPage+1)*BooksComponent.BOOKS_PER_PAGE; 
         i++) {
           this.pageBooks.push(this.books[i]);
         }
  }
}
