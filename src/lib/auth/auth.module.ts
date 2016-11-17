import { NgModule } from '@angular/core';
import { JsonpModule } from '@angular/http';
import { provideAuth, AuthHttp } from 'angular2-jwt';

import { Auth0Service, AUTH0_ID_TOKEN } from './auth0.service';
import { FirebaseAuthService } from './fireauth.service';


@NgModule({
  imports: [
    JsonpModule
  ],
  providers: [
    Auth0Service,
    FirebaseAuthService,
    provideAuth({
      tokenName: AUTH0_ID_TOKEN,
    }),
  ],
  exports: [
    // Auth0Service
  ]
})
export class AuthModule { }
