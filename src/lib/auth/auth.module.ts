import { NgModule } from '@angular/core';
import { provideAuth } from 'angular2-jwt';

import { AuthService } from './auth0.service';
import { FirebaseAuthService } from './fireauth.service';
import { AUTH_ID_TOKEN } from '../const';


@NgModule({
  providers: [
    AuthService,
    FirebaseAuthService,
    provideAuth({
      tokenName: AUTH_ID_TOKEN,
    }),
  ],
})
export class AuthModule { }
