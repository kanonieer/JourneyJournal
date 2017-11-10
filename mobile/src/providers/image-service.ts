import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { serverAdress } from './../shared/globalVariables';
import { handleError } from './../shared/errorHandler';

@Injectable()

export class ImageService {

  constructor(private _http: Http) {

  }

  private headers = new Headers({'Content-Type': 'application/json'});
  private options = new RequestOptions({headers: this.headers});

  saveImage(payload: any): Observable<any> {
    return this._http.post(serverAdress + '/images', JSON.stringify(payload), this.options)
      .map((response: Response) => response.json())
      .catch(handleError);
  }
}
