import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import * as firebase from 'firebase';

import { fireauthConfig, authenticationServerConfig } from './fireauth.config';

firebase.initializeApp(fireauthConfig);

const HOST = authenticationServerConfig.host;


@Injectable()
export class FirebaseAuthService {
  readonly firebaseAuthenticated = new BehaviorSubject<boolean>(false);
  readonly firebaseCurrentUser$ = new BehaviorSubject<User | null>(null);


  constructor(
    private http: Http,
  ) {
    this.stanby();
  }


  login(userId: string): void {
    this.http.post(HOST + '/createCustomToken', JSON.stringify({ userId }))
      .map(res => res.json() as { customToken: string })
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
        this.firebaseCurrentUser$.next(user);
      } else {
        console.log('Firebase Auth: LOG-OUT');
        this.firebaseCurrentUser$.next(null);
      }
    });
  }


  get currentUser$(): Observable<User | null> {
    return this.firebaseCurrentUser$.asObservable();
  }

}


type User = firebase.User;
