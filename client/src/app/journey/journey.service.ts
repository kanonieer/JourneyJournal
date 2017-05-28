import { Injectable }                               from '@angular/core';
import { Http, Headers, RequestOptions, Response }  from '@angular/http';
import { Observable }                               from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { apiAdress }    from './../shared/globalVariables';
import { Journey }      from './../models/Journey';

@Injectable()
export class JourneyService {

  constructor(private _http: Http) { }

  private headers = new Headers({'Content-Type':'application/json'});
  private options = new RequestOptions({headers: this.headers});

  getImages(id: String):Observable<any> {
    let access_token = localStorage.getItem('token');
    return this._http.get(apiAdress+'/journeys/'+id+'?access_token='+localStorage.getItem('token'), this.options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
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