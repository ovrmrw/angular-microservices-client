import { NgModule } from '@angular/core';
import { provideAuth } from 'angular2-jwt';

import { Auth0Service, AUTH0_ID_TOKEN } from './auth0.service';


@NgModule({
  providers: [
    Auth0Service,
    provideAuth({
      tokenName: AUTH0_ID_TOKEN,
    }),
  ],
  exports: [
    // Auth0Service
  ]
})
export class AuthModule { }
