import { Injectable, Optional, Inject } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';
import { tokenNotExpired } from 'angular2-jwt';
// import * as firebase from 'firebase';
declare const Auth0Lock: Auth0LockStatic;

import { FirebaseAuthService } from './fireauth.service';
import { auth0Config as config } from './auth0.config';
// import { firebaseConfig } from '../../environments/firebase';
// import { host } from '../../environments/params';

export const AUTH0_ID_TOKEN = 'auth0_id_token';
const AUTH0_PROFILE = 'auth0_profile';


const auth0ClientId = config.auth0ClientId;
const auth0Domain = config.auth0Domain;
const auth0Options = {
  auth: {
    redirect: false
  },
  autoclose: true,
};


@Injectable()
export class Auth0Service {
  private lock: Auth0LockStatic;
  readonly auth0Authenticated$ = new BehaviorSubject<boolean>(false);
  readonly auth0UserProfile$ = new BehaviorSubject<Auth0UserProfile | null>(null);


  constructor(
    @Inject(FirebaseAuthService) @Optional()
    private fireauthService: FirebaseAuthService | null,
  ) {
    this.nextAuthenticatedState();

    this.lock = new Auth0Lock(auth0ClientId, auth0Domain, auth0Options);

    this.lock.on('authenticated', authResult => {
      localStorage.setItem(AUTH0_ID_TOKEN, authResult.idToken);
      console.log('authResult:', authResult);
      this.nextAuthenticatedState();

      this.lock.getProfile(authResult.idToken, (err, profile) => {
        if (err) { throw err; }
        localStorage.setItem(AUTH0_PROFILE, JSON.stringify(profile));
        console.log('profile:', profile);
        this.nextAuthenticatedState();
      });
    });
  }


  login(): void {
    this.lock.show();
  }


  logout(): void {
    localStorage.removeItem(AUTH0_ID_TOKEN);
    localStorage.removeItem(AUTH0_PROFILE);
    this.nextAuthenticatedState();
  }


  get currentUserProfile$(): Observable<Auth0UserProfile | null> {
    return this.auth0UserProfile$.asObservable();
  }


  private nextAuthenticatedState(): void {
    const isAuthenticated: boolean = tokenNotExpired(AUTH0_ID_TOKEN);
    if (isAuthenticated) {
      console.log('Auth0: LOG-IN');
    } else {
      console.log('Auth0: LOG-OUT');
    }
    this.auth0Authenticated$.next(isAuthenticated);

    const profile: string | null = localStorage.getItem(AUTH0_PROFILE);
    if (profile && isAuthenticated) {
      const parsedProfile: Auth0UserProfile = JSON.parse(profile);
      this.auth0UserProfile$.next(parsedProfile);
      if (this.fireauthService) {
        const idToken: string | null = localStorage.getItem(AUTH0_ID_TOKEN);
        if (idToken) {
          this.fireauthService.login(idToken, parsedProfile.user_id);
        }
      }
    } else {
      this.auth0UserProfile$.next(null);
      if (this.fireauthService) {
        this.fireauthService.logout();
      }
    }
  }

}
