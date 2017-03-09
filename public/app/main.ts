import { bootstrap } from '@angular/platform-browser-dynamic';
import { Input, Component, OnInit, Injectable, enableProdMode } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { provideRouter, Router, RouterConfig, RouterLink, RouterOutlet } from '@angular/router';

import { HTTP_PROVIDERS, Http, Response, Request } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


import { BookService } from './services/book.service';
import { UserService } from './services/user.service';
import { InfoPanelComponent } from './components/info-panel/infoPanel.component';
import { BooksComponent } from './components/books/books.component';
import { UsersComponent } from './components/users/users.component'

import {appRouterProviders} from './routes';
import Approutes = require("./routes");

//enableProdMode();

@Component({
    selector: 'my-app',
    templateUrl: './app/main.component.html',
    directives: [BooksComponent, UsersComponent, InfoPanelComponent, RouterLink, RouterOutlet, ROUTER_DIRECTIVES ],
    providers: [BookService, UserService, HTTP_PROVIDERS, ROUTER_PROVIDERS]
})
export class AppComponent {
    private visibleState: any = { 
        booksAreVisible: true,
        usersAreVisible: false
    };


	constructor(private router: Router) {
		this.showBooks();
	}

	public redirectTo(path: string) {
        this.router.navigate([path]);
    }

    private resetVisibleState() {
        for (let p in this.visibleState) {
            this.visibleState[p] = false;
        }
    }

    showBooks(){
    	this.resetVisibleState();
    	this.visibleState['booksAreVisible'] = true;
    }

    showUsers(){
    	this.resetVisibleState();
    	this.visibleState['usersAreVisible'] = true;
    }
}

bootstrap (AppComponent, [HTTP_PROVIDERS, Approutes.appRouterProviders]);

