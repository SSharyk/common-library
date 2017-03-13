import { Component, OnInit } from '@angular/core';
import { BookModel } from '../../../models/BookModel';
import { BookService } from '../../../services/book.service';
import { BookDetailsFormComponent } from '../../book-details-form/bookDetailsForm.component';

@Component({
  selector: 'user-books',
  templateUrl: `./app/components/profile/user-books/userBooks.component.html`,
  styleUrls: ['./app/components/profile/user-books/userBooks.component.css'],
  directives: [BookDetailsFormComponent],
  providers: [BookService]
})
export class UserBooksComponent implements OnInit {
	title = 'Ваша личная библиотека';
	private books: BookModel[];
  private IsSelected: Boolean;
  private SelectedBook: BookModel;

	ngOnInit() {
		this.loadBooks();
	}
	constructor (private bookService: BookService) {
		this.books = [];
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
