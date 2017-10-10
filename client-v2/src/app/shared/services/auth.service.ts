import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { api } from './../global/variables';
import { handleError } from './../global/errorHandler';

@Injectable()
export class AuthService {

  constructor(private _http: Http) { }

  private headers = new Headers({'Content-Type':'application/json'});
  private options = new RequestOptions({headers: this.headers});

  public authFacebook(): Observable<any>{
    return this._http.get(api + '/auth/facebook', this.options)
      .map((response: Response) => response.json())
      .catch(handleError);
  }

  public authDropbox(): Observable<any>{
    return this._http.get(api + '/auth/dropbox', this.options)
      .map((response: Response) => response.json())
      .catch(handleError);
  }

  public signUp(payload: any): Observable<any>{
    return this._http.post(api + '/signup', JSON.stringify(payload), this.options)
      .map((response: Response) => response.json())
      .catch(handleError);
  }

  public signIn(payload: any): Observable<any>{
    return this._http.post(api + '/login', JSON.stringify(payload), this.options)
      .map((response: Response) => response.json())
      .catch(handleError);
  }
}
