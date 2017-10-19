import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as dbox from 'dbox';

@Injectable()
export class DropboxService {
    private config = {
        app_key: '3r3023rippa392m',
        app_secret: 'g4539w2dfqgerfs'
    };

    private app = dbox.app({ app_key: this.config.app_key, app_secret: this.config.app_secret });

    public authUser() {
        this.app.requesttoken((status, request_token) => {
            console.log(request_token);
          });
    }
}
