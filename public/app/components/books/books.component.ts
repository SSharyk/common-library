import { Component, OnInit } from '@angular/core';
import { BookModel } from '../../models/BookModel';
import { SearchModel } from '../../models/SearchModel'
import { BookService } from '../../services/book.service';
import { BookItemComponent } from '../book-item/bookItem.component';
import { BookDetailsFormComponent } from '../book-details-form/bookDetailsForm.component';

@Component({
  selector: 'all-books',
  templateUrl: `./app/components/books/books.component.html`,
  styleUrls: ['./app/components/books/books.component.css'],
  directives: [BookItemComponent, BookDetailsFormComponent],
  providers: [BookService]
})
export class BooksComponent implements OnInit {
	title = 'Ваша общая библиотека';
	private books: BookModel[];
  private search: SearchModel;
  private IsSelected: Boolean;
  private SelectedBook: BookModel;

	ngOnInit() {
		this.loadBooks();
	}
	constructor (private bookService: BookService) {
		this.books = [];
    this.search = new SearchModel();
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
  }

  closeForm() {
    this.IsSelected = false;
    this.SelectedBook = undefined;
  }
}
