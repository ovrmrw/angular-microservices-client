import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { GraphqlComponent } from './graphql/graphql.component';

import { GraphqlService } from './graphql/graphql.service';

import { AuthModule } from '../lib/auth';
import { DisposerModule } from '../lib/disposer';
import { StoreModule, AuthGuard } from '../lib/store';

import { WELCOME_PAGE, AppKind } from '../lib/const';


const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/welcome',
    pathMatch: 'full'
  },
  {
    path: WELCOME_PAGE,
    component: WelcomeComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'graphql',
    component: GraphqlComponent,
    canActivate: [AuthGuard],
  }
];


@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    LoginComponent,
    WelcomeComponent,
    GraphqlComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    StoreModule,
    AuthModule,
    DisposerModule,
  ],
  providers: [
    GraphqlService,
    { provide: AppKind, useValue: 'web' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
