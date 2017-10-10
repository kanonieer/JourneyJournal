import { Injectable } from '@angular/core';
import * as dbox from 'dbox';

@Injectable()
export class DropboxService {
    private config = {
        app_key: '3r3023rippa392m',
        app_secret: 'g4539w2dfqgerfs'
    };

    private app = dbox.app({ app_key: this.config.app_key, app_secret: this.config.app_secret });
    private client;
    private access_token = '';

    public authUser(request_token) {
        this.app.accesstoken(request_token, function(status, access_token){
            console.log(status);
            // this.access_token = access_token;
            // this.client = this.app.client(access_token);
          })
    }

    public getFile() {
        this.client = this.app.client(this.access_token);
        this.client.get('4.jpg', function(status, reply, metadata){
            console.log(reply.toString(), metadata);
          })
    }
}
