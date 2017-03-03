import { Component, OnInit } from '@angular/core';
import { BookModel } from '../../models/BookModel';
import { SearchModel } from '../../models/SearchModel'
import { BookService } from '../../services/book.service';
import { BookItemComponent } from '../book-item/bookItem.component';

@Component({
  selector: 'all-books',
  templateUrl: `./app/components/books/books.component.html`,
  styleUrls: ['./app/components/books/books.component.css'],
  directives: [BookItemComponent],
  providers: [BookService]
})
export class BooksComponent implements OnInit {
	title = 'Ваша общая библиотека';
	private books: BookModel[];
  private search: SearchModel;

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
}
