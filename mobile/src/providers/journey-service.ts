import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { serverAdress } from './../shared/globalVariables';
import { handleError } from './../shared/errorHandler';

import { Journey } from './../models/Journey';

@Injectable()

export class JourneyService {

  constructor(private _http: Http) {

  }

  private headers = new Headers({'Content-Type': 'application/json'});
  private options = new RequestOptions({headers: this.headers});

  addJourney(payload: any): Observable<any> {
    return this._http.post(serverAdress + '/journeys', JSON.stringify(payload), this.options)
      .map((response: Response) => response.json())
      .catch(handleError);
  }

  getJourneys(): Observable<Array<Journey>> {
    let access_token = localStorage.getItem('token');
    return this._http.get(serverAdress + '/journeys?access_token=' + access_token, this.options)
      .map((response: Response) => response.json())
      .catch(handleError);
  }
  
  deleteJourney(id: any): Observable<any> {
    let access_token = localStorage.getItem('token');
    return this._http.delete(serverAdress + '/journeys/' + id + '?access_token=' + access_token, this.options)
      .map((response: Response) => response.json())
      .catch(handleError);
  }
}
