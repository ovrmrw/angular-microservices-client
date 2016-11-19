import { Injectable, Optional, Inject } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import { tokenNotExpired } from 'angular2-jwt';
import Auth0Lock from 'auth0-lock';

import { AuthUser } from '../types';
import { Store, Dispatcher, Action, NextAuthIdToken, NextAuthUserProfile } from '../store';

import { FirebaseAuthService } from './fireauth.service';
import { auth0Config as config } from './auth0.config';
import { AUTH_ID_TOKEN, AUTH_PROFILE } from '../const';


const auth0ClientId = config.auth0ClientId;
const auth0Domain = config.auth0Domain;
const auth0Options = {
  auth: {
    // redirect: false
  },
  autoclose: true,
};


@Injectable()
export class AuthService {
  private lock: Auth0LockStatic;
  readonly auth0User$ = new ReplaySubject<AuthUser | null>();


  constructor(
    @Inject(FirebaseAuthService) @Optional()
    private fireauthService: FirebaseAuthService | null,
    private dispatcher$: Dispatcher<Action>,
    private store: Store,
  ) {
    (async () => {
      this.initAuthenticatedState();
      await this.nextAuthenticatedState();

      this.lock = new Auth0Lock(auth0ClientId, auth0Domain, auth0Options);

      this.lock.on('authenticated', async (authResult) => {
        this.dispatcher$.next(new NextAuthIdToken(authResult.idToken));
        console.log('authResult:', authResult);
        await this.nextAuthenticatedState();

        this.lock.getProfile(authResult.idToken, async (err, profile) => {
          if (err) { throw err; }
          this.dispatcher$.next(new NextAuthUserProfile(profile));
          console.log('profile:', profile);
          await this.nextAuthenticatedState();
        });
      });
    })();
  }


  login(): void {
    this.lock.show();
  }


  async logout(): Promise<void> {
    this.dispatcher$.next(new NextAuthIdToken(null));
    this.dispatcher$.next(new NextAuthUserProfile(null));
    await this.nextAuthenticatedState();
  }


  private initAuthenticatedState(): void {
    const idToken: string | null = localStorage.getItem(AUTH_ID_TOKEN);
    this.dispatcher$.next(new NextAuthIdToken(idToken));

    const profile: string | null = localStorage.getItem(AUTH_PROFILE);
    if (profile) {
      const parsedProfile: AuthUser = JSON.parse(profile);
      this.dispatcher$.next(new NextAuthUserProfile(parsedProfile));
    } else {
      this.dispatcher$.next(new NextAuthUserProfile(null));
    }
  }


  private async nextAuthenticatedState(): Promise<void> {
    const isTokenNotExpired: boolean = tokenNotExpired(AUTH_ID_TOKEN);
    if (isTokenNotExpired) {
      console.log('Auth0: LOG-IN');
    } else {
      console.log('Auth0: LOG-OUT');
    }

    const state = await this.store.getState().take(1).toPromise();

    if (isTokenNotExpired && state.authUser) {
      if (this.fireauthService) {
        if (state.authIdToken) {
          await this.fireauthService.login(state.authIdToken, state.authUser.user_id);
        }
      }
    } else {
      if (this.fireauthService) {
        await this.fireauthService.logout();
      }
    }
  }

}
