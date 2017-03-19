import { Component, EventEmitter, Input, Output, OnInit } from "@angular/core"
import { Control, ControlGroup, FormBuilder, Validators, FORM_DIRECTIVES  } from "@angular/common";
import { AuthorModel } from '../../../models/AuthorModel';
import { BookModel } from '../../../models/BookModel';
import { BookService } from '../../../services/book.service';

@Component({
  selector: 'book-adding-form',
  templateUrl: `./app/components/profile/adding-form/bookAddingForm.component.html`,
  styleUrls: ['../../../stylesheets/bootstrap.min.css',
              './app/components/profile/adding-form/bookAddingForm.component.css'],
  providers: [FormBuilder, BookService],
  directives: [FORM_DIRECTIVES]
})
export class BookAddingFormComponent implements OnInit {
  @Output() onFormClosed: EventEmitter<BookModel>;
  @Output() onDeleted: EventEmitter<Boolean>;

  @Input()
  private book: BookModel;
  private authors: String;

  private _modalHeader: String = "Добавление новой книги";
  private _bookForm: ControlGroup;
  private TitleControl:Control;
  private DescriptionControl: Control;
  private AuthorsControl:Control;
  private PagesControl:Control;
  private YearControl:Control;

  ngOnInit() {
    if (this.book == undefined || this.book == null) {
      let bookObj = {
        book: {
          title: '',
          description: '',
          authors: [],
          year: 2017,
          pages: 3
        },
        user: JSON.parse(localStorage.getItem("CURRENT_USER_KEY"))
      };
      this.book = new BookModel(bookObj);
      this._modalHeader = "Добавление новой книги";
    } else {
      this._modalHeader = "Обновить информацию о книге";
    }

    this.TitleControl = new Control(this.book.Title, Validators.required);
    this.DescriptionControl = new Control(this.book.Description, Validators.maxLength(255));
    this.AuthorsControl = new Control(this.getAuthorsString(this.book.Authors), Validators.required);
    this.PagesControl = new Control(this.book.Pages, Validators.required);
    this.YearControl = new Control(this.book.Year, Validators.required);

    this._bookForm = this._formBuilder.group({
      Title: this.TitleControl,
      Description: this.DescriptionControl,
      Authors: this.AuthorsControl,
      Pages: this.PagesControl,
      Year: this.YearControl
    });
  }

  constructor(private _formBuilder: FormBuilder, private _bookService: BookService) {
    this.onFormClosed = new EventEmitter<BookModel>(false);
    this.onDeleted = new EventEmitter<Boolean>(false);
  }

  save() {
    if (this._bookForm.valid) {
      this.setBook();
      this.onFormClosed.emit(this.book);
    }
    else
      console.error("Required fields are not filled");
  }

  closeForm() {
    this.onFormClosed.emit(null);
  }

  setBook() {
    this.book.Title = this.TitleControl.value;
    this.book.Description = this.DescriptionControl.value;
    this.book.Pages = this.PagesControl.value;
    this.book.Year = this.YearControl.value;
    this.correctAuthors();
  }

  correctAuthors() {
    this.book.Authors = [];
    let authorsString = new String(this.AuthorsControl.value).split(",");
    for (var i=0; i<authorsString.length; i++) {
      let components = (authorsString[i] + "  ").split(" ");

      let firstName = components[0];
      components = components.splice(1);

      let lastName = components.join(" ");
      let authObj = { 
        firstName: firstName, 
        lastName: lastName 
      };
      let author = new AuthorModel(authObj);
      this.book.Authors.push(author);
    }
  }

  getAuthorsString(authors: AuthorModel[]) {
    let aS: string = "";
    for (let i=0; i<authors.length; i++) {
      aS += (authors[i].FullName + ", ");
    }
    return aS.substr(0, aS.length - 2);
  }

  delete() {
    this._bookService.deleteBook(this.book).subscribe(
      (resp) => this.onDeleted.emit(true),
      (err) => { alert("Во время удаления произошла ошибка. Пожалуйста, повторите ошибку позднее или обратитесь к разработчику"); }
    );
  }
}
