import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import * as firebase from 'firebase';

import { Dispatcher, Action, NextFirebaseUserProfile } from '../store';
import { FirebaseUser } from '../types';
import { fireauthConfig, createCustomTokenFunctionConfig as functionConfig } from './fireauth.config';

firebase.initializeApp(fireauthConfig);

const ENDPOINT = functionConfig.api + functionConfig.function;


@Injectable()
export class FirebaseAuthService {
  readonly firebaseCurrentUser$ = new ReplaySubject<FirebaseUser | null>();


  constructor(
    private http: Http,
    private dispatcher$: Dispatcher<Action>,
  ) {
    this.stanby();
  }


  async login(auth0IdToken: string, user_id: string): Promise<void> {
    const headers = new Headers({
      'Authorization': 'Bearer ' + auth0IdToken,
      'x-functions-key': functionConfig.code,
    });

    const result = await this.http.post(ENDPOINT, { user_id }, { headers })
      .timeoutWith(1000 * 30, Observable.throw('timeout'))
      .map(res => res.json().result as { customToken: string })
      .toPromise();
    console.log('createCustomToken result:', result);
    await firebase.auth().signInWithCustomToken(result.customToken);
  }


  async logout(): Promise<void> {
    await firebase.auth().signOut();
  }


  stanby(): void {
    firebase.auth().onAuthStateChanged((user: FirebaseUser) => {
      if (user) {
        console.log('Firebase Auth: LOG-IN');
        console.log('user:', user);
        // this.firebaseCurrentUser$.next(user);
        this.dispatcher$.next(new NextFirebaseUserProfile(user));
      } else {
        console.log('Firebase Auth: LOG-OUT');
        // this.firebaseCurrentUser$.next(null);
        this.dispatcher$.next(new NextFirebaseUserProfile(null));
      }
    });
  }


  async writeUserProfile(auth0UserProfile: Auth0UserProfile, firebaseUser: firebase.User): Promise<void> {
    const user = firebase.auth().currentUser;
    if (user) {
      const p1 = firebase.database().ref('profile/' + user.uid + '/auth0').set(auth0UserProfile) as Promise<any>;

      const parsedFirebaseUser = JSON.parse(JSON.stringify(firebaseUser));
      const p2 = firebase.database().ref('profile/' + user.uid + '/firebase').set(parsedFirebaseUser) as Promise<any>;

      await Promise.all([p1, p2]).catch(err => console.error(err));
    }
  }

}
