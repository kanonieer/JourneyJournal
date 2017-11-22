import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

export function successHandle(success: Response) {
    
    return success.json();
}

export function errorHandle(error: Response) {
    
    if (error.status === 401) {
        return Observable.throw(error.statusText);
    }
    if (error.status === 500) {
        return Observable.throw('Server down');
    } else {
        return Observable.throw(error.json().error || 'Server error');
    }
}

export function errorHandleAccount(error: Response) {

    if (error.status === 401) {
        return Observable.throw(error.json());
    }
    if (error.status === 500) {
        return Observable.throw('Server down');
    } else {
        return Observable.throw(error.json().error || 'Server error');
    }
}