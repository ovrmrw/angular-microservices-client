import { Injectable, Optional, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import { tokenNotExpired } from 'angular2-jwt';
import Auth0Lock from 'auth0-lock';

import { AuthUser } from '../types';
import { Store, Dispatcher, Action, NextAuthIdTokenAction, NextAuthUserProfileAction, LogoutAction } from '../store';

import { FirebaseAuthService } from './fireauth.service';
import { auth0Config as config } from './auth0.config';
import { AUTH_ID_TOKEN, AUTH_PROFILE, WELCOME_PAGE, AppKind } from '../const';


const auth0ClientId = config.auth0ClientId;
const auth0Domain = config.auth0Domain;
const auth0Options = {
  auth: {
    redirect: false
  },
  autoclose: true,
  // redirectUrl: location.protocol + location.host,
};


@Injectable()
export class AuthService {
  private lock: Auth0LockStatic;
  readonly auth0User$ = new ReplaySubject<AuthUser | null>();


  constructor(
    private router: Router,
    private dispatcher$: Dispatcher<Action>,
    private store: Store,
    @Inject(AppKind)
    private appKind: string,
    @Inject(FirebaseAuthService) @Optional()
    private fireauthService: FirebaseAuthService | null,
  ) {
    (async () => {
      this.initAuthenticatedState();
      await this.nextAuthenticatedState();

      this.lock = new Auth0Lock(auth0ClientId, auth0Domain, auth0Options);

      this.lock.on('authenticated', async (authResult) => {
        this.dispatcher$.next(new NextAuthIdTokenAction(authResult.idToken));
        console.log('authResult:', authResult);
        await this.nextAuthenticatedState();

        this.lock.getProfile(authResult.idToken, async (err, profile) => {
          if (err) { throw err; }
          this.dispatcher$.next(new NextAuthUserProfileAction(profile));
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
    this.dispatcher$.next(new LogoutAction());
    if (this.fireauthService) {
      await this.fireauthService.logout();
    }
  }


  private initAuthenticatedState(): void {
    if (this.isTokenAcceptable) {
      const idToken: string | null = localStorage.getItem(AUTH_ID_TOKEN);
      this.dispatcher$.next(new NextAuthIdTokenAction(idToken));

      const profile: string | null = localStorage.getItem(AUTH_PROFILE);
      if (profile) {
        const parsedProfile: AuthUser = JSON.parse(profile);
        this.dispatcher$.next(new NextAuthUserProfileAction(parsedProfile));
      } else {
        this.dispatcher$.next(new NextAuthUserProfileAction(null));
      }
    }
  }


  private async nextAuthenticatedState(): Promise<void> {
    if (this.isTokenAcceptable) {
      console.log('Auth0: LOG-IN');
      const state = await this.store.getState().take(1).toPromise();
      if (this.fireauthService && state.authIdToken && state.authUser) {
        await this.fireauthService.login(state.authIdToken, state.authUser.user_id);
      }
    } else {
      console.log('Auth0: LOG-OUT');
      this.logout();
      if (this.appKind === 'web') {
        this.router.navigate(['/' + WELCOME_PAGE]);
      }
    }
  }


  private get isTokenAcceptable(): boolean {
    const flag = tokenNotExpired(AUTH_ID_TOKEN);
    if (flag) {
      console.log('tokenNotExpired() === true');
      return true;
    } else {
      console.log('tokenNotExpired() === false');
      return false;
    }
  }

}
