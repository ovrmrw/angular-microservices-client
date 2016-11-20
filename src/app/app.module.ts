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
import { StoreModule } from '../lib/store';


const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/welcome',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    component: WelcomeComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'graphql',
    component: GraphqlComponent
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
    AuthModule,
    DisposerModule,
    StoreModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    GraphqlService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
