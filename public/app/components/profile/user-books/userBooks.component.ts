import { Component, OnInit, EventEmitter } from '@angular/core';
import { BookModel } from '../../../models/BookModel';
import { MessageModel } from '../../../models/MessageModel';
import { BookService } from '../../../services/book.service';
import { BookDetailsFormComponent } from '../../book-details-form/bookDetailsForm.component';
import { BookAddingFormComponent } from '../adding-form/bookAddingForm.component';

@Component({
  selector: 'user-books',
  templateUrl: `./app/components/profile/user-books/userBooks.component.html`,
  styleUrls: ['./app/components/profile/user-books/userBooks.component.css'],
  directives: [BookDetailsFormComponent, BookAddingFormComponent],
  providers: [BookService]
})
export class UserBooksComponent implements OnInit {
	title = 'Ваша личная библиотека';
	private books: BookModel[];
  private IsSelected: Boolean;
  private SelectedBook: BookModel;
  private IsCreationCalled: Boolean;
  private IsEditing: Boolean;
  private IsDialog: Boolean;
  private SelectedDialogIndex: Number = 0;

	ngOnInit() {
		this.loadBooks();
	}
	constructor (private bookService: BookService) {
		this.books = [];
  }

	loadBooks() {
		this.bookService.loadUserBooks().subscribe(
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
    this.IsEditing = true;
  }

  closeForm() {
    this.IsSelected = false;
    this.SelectedBook = undefined;
  }

  showAddingForm() {
    this.IsCreationCalled = true;
    this.IsEditing = false;
  }

  closeAddingForm(book: BookModel) {
    this.IsCreationCalled = false;
    this.IsSelected = false;
    if (book != null) {
      if (this.IsEditing) {
        // update existing book
        this.bookService.deleteBook(this.SelectedBook).subscribe(
          (resp) => this.bookDeletedSuccess(book),
          (err)  => this.bookAddedFail(err)
        );
      } else {
        // create new book
        this.bookService.createBook(book).subscribe(
          (resp) => this.bookAddedSuccess(resp),
          (err)  => this.bookAddedFail(err)
        );    
      }
    }
    this.IsEditing = false;
  }

  bookAddedSuccess(resp) {
    let book = new BookModel(JSON.parse(resp["_body"]));
    this.books.push(book);
  }

  bookDeletedSuccess(book) {
    let index = this.books.indexOf(this.SelectedBook);
    this.books.splice(index, 1);

    this.bookService.createBook(book).subscribe(
      (resp) => this.bookAddedSuccess(resp),
      (err)  => this.bookAddedFail(err)
    ); 
  }

  bookAddedFail(err) {
    console.error(err);
  }

  deleted(isSuccess: Boolean) {
    if (isSuccess) {
      let index = this.books.indexOf(this.SelectedBook);
      this.books.splice(index, 1);
      this.SelectedBook = null;
      this.IsEditing = false;
      this.IsSelected = false;
    }
  }

  showDialogForm(book: BookModel, dialog: MessageModel) {
    this.SelectedBook = book;
    this.SelectedDialogIndex = book.Messages.indexOf(dialog);
    this.IsSelected = false;
    this.IsDialog = true;
  }

  closeDialogForm() {
    this.IsDialog = false;
    this.IsSelected = false;
    this.SelectedDialogIndex = 0;
  }
}
