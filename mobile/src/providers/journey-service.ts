import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

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

  public addJourney(payload: any): Observable<any> {
    return this._http.post(serverAdress + '/journeys', JSON.stringify(payload), this.options)
      .map(successHandle)
      .catch(errorHandle);
  }

  public editJourney(id: any, payload: any): Observable<any> {
    return this._http.patch(serverAdress + '/journeys/' + id, JSON.stringify(payload), this.options)
      .map(successHandle)
      .catch(errorHandle);
  }

  public getJourneys(): Observable<Array<Journey>> {
    const access_token = this.storageSvc.get('token');

    return this._http.get(serverAdress + '/journeys?access_token=' + access_token, this.options)
      .map(successHandle)
      .catch(errorHandle);
  }
  
  public deleteJourney(id: any): Observable<any> {
    const access_token = this.storageSvc.get('token');
    
    return this._http.delete(serverAdress + '/journeys/' + id + '?access_token=' + access_token, this.options)
      .map(successHandle)
      .catch(errorHandle);
  }
}
