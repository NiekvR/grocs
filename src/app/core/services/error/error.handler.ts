import {ErrorHandler, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map, switchMap} from 'rxjs/operators';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({providedIn: 'root'})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private http: HttpClient, private afAuth: AngularFireAuth) {}

  handleError(error: Error) {
    environment.production ?
      this.sendFeedback(error) :
      this.handleDebugError(error);
  }

  private sendFeedback(err: Error) {
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;

    if (chunkFailedMessage.test(err.message)) {
      window.location.reload();
    }

    this.afAuth.authState
      .pipe(map(user => (
          {
            user: user.email,
            date: new Date(),
            type: err.name,
            description: err.message,
            stacktrace: err.stack,
            project: 'grocs'
          } as Exception)),
        switchMap(exception => this.http.post('https://tern-support.firebaseapp.com/api/v1/log/error', exception, {responseType: 'text'})))
      .subscribe(() => console.log('Error logged, contact support!'));
  }

  private handleDebugError(err: Error) {
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;

    if (chunkFailedMessage.test(err.message)) {
      window.location.reload();
    }

    console.error(err);
  }
}

interface Exception {
  user: string;
  date: Date;
  type: string;
  description: string;
  stacktrace: string;
  project: string;
}
