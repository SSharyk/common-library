import { bootstrap } from '@angular/platform-browser-dynamic';
import { Input, Component, OnInit, Injectable, enableProdMode } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { HTTP_PROVIDERS, Http, Response, Request } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { BookService } from './services/book.service';
import { BooksComponent } from './components/books/books.component';

//enableProdMode();

@Component({
    selector: 'my-app',
    template: `<all-books>..loading..</all-books>`,
    directives: [BooksComponent],
    providers: [BookService, HTTP_PROVIDERS, ROUTER_PROVIDERS]
})
export class AppComponent {
}

bootstrap (AppComponent)

