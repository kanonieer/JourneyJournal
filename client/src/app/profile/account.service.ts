import { Injectable }                               from '@angular/core';
import { Http, Headers, RequestOptions, Response }  from '@angular/http';
import { Observable }                               from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { apiAdress }    from './../shared/globalVariables';
import { handleError }  from './../shared/handleError';
import { Payload } from './../models/Payload';
@Injectable()
export class AccountService {

  constructor(private _http: Http) { }

  private headers = new Headers({'Content-Type':'application/json'});
  private options = new RequestOptions({headers: this.headers});

  changeEmail(form: any):Observable<any>{
    let payload = {
      form: form,
      access_token: localStorage.getItem('token')
    };
    return this._http.patch(apiAdress+'/email', JSON.stringify(payload), this.options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  changePassword(form: any):Observable<any>{
    let payload = {
      form: form,
      access_token: localStorage.getItem('token')
    };
    return this._http.patch(apiAdress+'/password', JSON.stringify(payload), this.options)
      .map((response: Response) => response.json())
      .catch(handleError);
  }

  private handleError(error: Response) {
        if (error.status === 401) {
            return Observable.throw(error.json());
        }
        if (error.status === 500) {
            return Observable.throw('Server down');
        }
        else{
            return Observable.throw(error.json().error || 'Server error');             
        }
    }
}
