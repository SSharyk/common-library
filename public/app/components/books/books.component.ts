import { Component, OnInit } from '@angular/core';
import { BookModel } from '../../models/BookModel';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'all-books',
  templateUrl: `./app/components/books/books.component.html`,
  styleUrls: ['./app/components/books/books.component.css'],
  providers: [BookService]
})
export class BooksComponent implements OnInit {
	title = 'The list of books in the system';
	private books: BookModel[];

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
        console.log(res);
        var book = new BookModel(res);
        this.books.push(book);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
