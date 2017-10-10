import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

export function handleError(error: Response) {
    if (error.status === 401) {
        return Observable.throw('Unauthorized');
    }
    if (error.status === 500) {
        return Observable.throw('Server down');
    } else {
        return Observable.throw(error.json().error || 'Server error');
    }
}
