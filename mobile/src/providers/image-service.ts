import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// Shared
import { serverAdress } from './../shared/globalVariables';
import { successHandle, errorHandle } from './../shared/Handler';

// Providers
import { StorageService } from '../providers/storage-service';

@Injectable()

export class ImageService {

  constructor(private _http: Http, private storageSvc: StorageService) {

  }

  public headers = new Headers({'Content-Type': 'application/json'});
  public options = new RequestOptions({headers: this.headers});

  public saveImage(payload: any): Observable<any> {
    return this._http.post(serverAdress + '/images', JSON.stringify(payload), this.options)
      .map(successHandle)
      .catch(errorHandle);
  }

  public getImagesByJourney(journey_id: string): Observable<any> {
    const access_token = this.storageSvc.get('token');

    return this._http.get(serverAdress + '/journeys/' + journey_id + '/images?access_token=' + access_token, this.options)
      .map(successHandle)
      .catch(errorHandle);
  }
}
