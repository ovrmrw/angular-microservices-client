import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import * as firebase from 'firebase';

import { fireauthConfig, createCustomTokenFunctionConfig as functionConfig } from './fireauth.config';

firebase.initializeApp(fireauthConfig);

const ENDPOINT = functionConfig.api + functionConfig.function;


@Injectable()
export class FirebaseAuthService {
  // readonly firebaseAuthenticated = new BehaviorSubject<boolean>(false);
  readonly firebaseCurrentUser$ = new ReplaySubject<FirebaseUser | null>();


  constructor(
    // private http: Http,
    private http: Http,
  ) {
    this.stanby();
  }


  async login(auth0IdToken: string, user_id: string): Promise<void> {
    const headers = new Headers({
      'Authorization': 'Bearer ' + auth0IdToken,
      'x-functions-key': functionConfig.code,
    });

    try {
      const result = await this.http.post(ENDPOINT, { user_id }, { headers })
        // .timeoutWith(2000, Observable.throw('timeout'))
        .map(res => res.json().result as { customToken: string })
        .toPromise();
      console.log('createCustomToken result:', result);
      await firebase.auth().signInWithCustomToken(result.customToken);
    } catch (err) {
      console.error(err);
    }
    return;
  }


  async logout(): Promise<void> {
    return await firebase.auth().signOut();
  }


  stanby(): void {
    firebase.auth().onAuthStateChanged((user: FirebaseUser) => {
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


  writeUserProfile(auth0UserProfile: Auth0UserProfile, firebaseUser: firebase.User): void {
    const user = firebase.auth().currentUser;
    if (user) {
      firebase.database().ref('profile/' + user.uid + '/auth0').set(auth0UserProfile)
        .then(() => { })
        .catch(err => console.error(err));

      const parsedFirebaseUser = JSON.parse(JSON.stringify(firebaseUser));
      firebase.database().ref('profile/' + user.uid + '/firebase').set(parsedFirebaseUser)
        .then(() => { })
        .catch(err => console.error(err));
    }
  }


  get currentUser$(): Observable<FirebaseUser | null> {
    return this.firebaseCurrentUser$.asObservable();
  }

}


export type FirebaseUser = firebase.User;
