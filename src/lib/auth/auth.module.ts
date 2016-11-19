import { NgModule } from '@angular/core';
import { provideAuth } from 'angular2-jwt';

import { Auth0Service, AUTH0_ID_TOKEN } from './auth0.service';
import { FirebaseAuthService } from './fireauth.service';


@NgModule({
  providers: [
    Auth0Service,
    FirebaseAuthService,
    provideAuth({
      tokenName: AUTH0_ID_TOKEN,
    }),
  ]
})
export class AuthModule { }
