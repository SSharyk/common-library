import { provideRouter, RouterConfig } from '@angular/router';
import { BooksComponent } from './components/books/books.component';
import { UsersComponent } from './components/users/users.component';
import { UserBooksComponent } from './components/profile/user-books/userBooks.component';

const routes: RouterConfig = [    
    { path: '', component: BooksComponent },
    { path: 'books', component: BooksComponent },
    { path: 'my', component: UserBooksComponent },
    { path: 'users', component: UsersComponent }
];

export const appRouterProviders = [
    provideRouter(routes)
];