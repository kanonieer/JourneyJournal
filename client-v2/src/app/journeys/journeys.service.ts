import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { handleError } from './../shared/global/errorHandler';

import { StorageService } from './../shared/services/storage.service';
import { api } from './../shared/global/variables';
import { Journey } from './../shared/models/Journey';

@Injectable()
export class JourneysService {

  constructor(
      private _http: Http,
      private storageService: StorageService
    ) { }

  private headers = new Headers({'Content-Type': 'application/json'});
  private options = new RequestOptions({headers: this.headers});

  getJourneys(): Observable<Array<Journey>> {
    const access_token = this.storageService.get('token');

    return this._http.get(api + '/journeys?access_token=' + access_token, this.options)
      .map((response: Response) => response.json())
      .catch(handleError);
  }
}
