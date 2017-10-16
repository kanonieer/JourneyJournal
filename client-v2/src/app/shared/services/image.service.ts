import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { api } from './../global/variables';
import { handleError } from './../global/errorHandler';
import { Image } from './../models/Image';
import { StorageService } from './storage.service';

@Injectable()
export class ImageService {

  constructor(
    private http: Http,
    private storageService: StorageService
  ) { }

  private headers = new Headers({'Content-Type': 'application/json'});
  private options = new RequestOptions({headers: this.headers});

  public getImagesByJourney(journey_id: string): Observable<any> {
    const access_token = this.storageService.get('token');

    return this.http.get(api + '/journeys/' + journey_id + '?access_token=' + access_token, this.options)
      .map((response: Response) => response.json())
      .catch(handleError);
  }
}
