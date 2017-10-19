export class Payload {
    access_token: String;
    form: Object;

    constructor(){
        this.access_token = localStorage.getItem['token'];
        this.form = {};
    }
}