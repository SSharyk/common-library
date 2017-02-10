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
            	//this.onBooksLoad(result) 
              console.log("result is ", result);
              var resp = JSON.parse(result["_body"]);
              console.log(resp);
              resp.forEach( (item, i, array) => this.getBookFromResponse(item));
            },
            (error) => {
            	console.error(error);
            }
        );
	}

  getBookFromResponse(item) {
    var book = new BookModel(item);
    console.log("book is ", book);
    this.books.push(book);
  }
}
