import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { catchError } from 'rxjs/operators/catchError';

// Shared
import { serverAdress } from './../shared/GlobalVariables';
import { successHandle, errorHandle } from './../shared/Handler';

// Providers
import { StorageService } from '../providers/storage-service';

// Models
import { Journey } from './../models/Journey';

@Injectable()
export class JourneyService {

  constructor(private _http: Http, private storageSvc: StorageService) {

  }

  public headers = new Headers({'Content-Type': 'application/json'});
  public options = new RequestOptions({headers: this.headers});
  public user_id = this.storageSvc.get('user_id');
  public access_token = this.storageSvc.get('token');

  public addJourney(payload: any): Observable<any> {
    return this._http.post(serverAdress + '/journeys', JSON.stringify(payload), this.options).pipe(
      map(successHandle),
      catchError(errorHandle)
    );
  }

  public editJourney(id: any, payload: any): Observable<any> {
    return this._http.patch(serverAdress + '/journeys/' + id, JSON.stringify(payload), this.options).pipe(
      map(successHandle),
      catchError(errorHandle)
    );
  }

  public getJourneys(): Observable<Array<Journey>> {
    return this._http.get(serverAdress + '/users/' + this.user_id + '/journeys?access_token=' + this.access_token, this.options).pipe(
      map(successHandle),
      catchError(errorHandle)
    );
  }
  
  public deleteJourney(id: any): Observable<any> {
    return this._http.delete(serverAdress + '/journeys/' + id + '?access_token=' + this.access_token, this.options).pipe(
      map(successHandle),
      catchError(errorHandle)
    );
  }
}
