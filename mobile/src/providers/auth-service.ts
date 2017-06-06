import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

export class User {
  email: string;

  constructor(email: string) {
    this.email = email;
  }
}


@Injectable()
export class AuthService {
  currentUser: User;
  constructor(private _http: Http) { }

  private headers = new Headers({'Content-Type':'application/json'});
  private options = new RequestOptions({headers: this.headers});

  loginBasic(payload: any): Observable<any>{
    return this._http.post('http://localhost:8080/login', JSON.stringify(payload), this.options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  authFacebook(): Observable<any>{
    return this._http.get('http://localhost:8080/auth/mobile/facebook', this.options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }
  getMe(payload: any): Observable<any>{
    return this._http.post('http://localhost:8080/profile', JSON.stringify(payload), this.options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  signUpBasic(payload: any): Observable<any>{
    return this._http.post('http://localhost:8080/signup', JSON.stringify(payload), this.options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }
  addJourney(payload: any): Observable<any>{
    return this._http.post('http://localhost:8080/journey', JSON.stringify(payload), this.options)
    .map((response: Response)=> response.json())
    .catch(this.handleError);
  }
  saveImage(payload: any): Observable<any>{
    return this._http.post('http://localhost:8080/image', JSON.stringify(payload), this.options)
    .map((response: Response)=> response.json())
    .catch(this.handleError);
  }

  public register(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }

  public getUserInfo() : User {
    return this.currentUser;
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }
  private handleError(error: Response) {
            if (error.status === 401) {
                return Observable.throw('Unauthorized');
            }
            if (error.status === 500) {
                return Observable.throw('Server down');
            }else{
                return Observable.throw(error.json().error || 'Server error');             
            }
  }
}
