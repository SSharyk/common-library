import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

export class HttpHelpers {
    constructor(private _http: Http) {
    }

    get haserror(): boolean {
        return this.errormsg != null;
    }

    errormsg: string;

    getaction(path: string) {
        return this._http.get(path);
            // .map(res => {
            //     return res.json();
            // })
            // .catch(this._handleError);
    }

    postaction<T>(path: string, param: T) {
        this.errormsg = null;
        let body = JSON.stringify(param);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(path, body, options)
            .map(m => {
                var jsonresult = m.json();
                if (jsonresult.haserror) {
                    this.errormsg = jsonresult.errormessage;
                }
                return jsonresult;
            })
            .catch(this._handleError);
    }


    deleteaction(path: string) {
        return this._http.delete(path)
            .map(res => res.json())
            .catch(this._handleError);
    }
    

    authaction(username: string, password: string, remember: boolean) {
        const credentials = {
            username: username,
            password: password,
            persistent: remember
        };
        let headers = new Headers();
        headers.append('Authorization',
            'Basic ' +
            btoa(JSON.stringify(credentials)));
        return this._http.get("api/auth/signin",
            {
                headers: headers
            })
            .map(res => {
                return res;
            })
            .catch(this._handleError);
    }
    
    logoutaction(path: string) {
        return this._http.get(path)
            .map(res => {
                return res;
            })
            .catch(this._handleError);
    }

    
    private _handleError(error: Response) {
        // redirect to login if not allowed or unauthorized
        if (error.status === 403) { 
            //window.location.href = './Home/Login';
        }
        return Observable.throw(error.statusText || 'Server error');
    }
}