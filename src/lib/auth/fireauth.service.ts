import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs/Rx';
import * as firebase from 'firebase';

import { fireauthConfig, createCustomTokenFunctionConfig as functionConfig } from './fireauth.config';

firebase.initializeApp(fireauthConfig);

const ENDPOINT = functionConfig.api + functionConfig.function;


@Injectable()
export class FirebaseAuthService {
  // readonly firebaseAuthenticated = new BehaviorSubject<boolean>(false);
  readonly firebaseCurrentUser$ = new ReplaySubject<User | null>();


  constructor(
    // private http: Http,
    private http: Http,
  ) {
    this.stanby();
  }


  login(auth0IdToken: string, user_id: string): void {
    const headers = new Headers({
      'Authorization': 'Bearer ' + auth0IdToken,
      'x-functions-key': functionConfig.code,
    });

    this.http.post(ENDPOINT, { user_id }, { headers })
      // .timeoutWith(2000, Observable.throw('timeout'))
      .map(res => res.json().result as { customToken: string })
      .subscribe(result => {
        console.log('createCustomToken result:', result);
        firebase.auth().signInWithCustomToken(result.customToken)
          .catch(err => { throw err; });
      }, err => { throw err; });
  }


  logout(): void {
    firebase.auth().signOut();
  }


  stanby() {
    firebase.auth().onAuthStateChanged((user: User) => {
      if (user) {
        console.log('Firebase Auth: LOG-IN');
        console.log('user:', user);
        this.firebaseCurrentUser$.next(user);
      } else {
        console.log('Firebase Auth: LOG-OUT');
        this.firebaseCurrentUser$.next(null);
      }
    });
  }


  writeUserProfile(auth0UserProfile: Auth0UserProfile) {
    const user = firebase.auth().currentUser;
    if (user) {
      firebase.database().ref('profile/' + user.uid + '/auth0').set(auth0UserProfile)
        .catch(err => console.error(err));

      const writableUser = JSON.parse(JSON.stringify(user));
      firebase.database().ref('profile/' + user.uid + '/firebase').set(writableUser)
        .catch(err => console.error(err));
    }
  }


  get currentUser$(): Observable<User | null> {
    return this.firebaseCurrentUser$.asObservable();
  }

}


type User = firebase.User;
