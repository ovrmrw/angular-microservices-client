import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { AuthService, FirebaseAuthService } from '../lib/auth';
import { AuthUser, FirebaseUser } from '../lib/types';
import { DisposerService } from '../lib/disposer';
import { Store } from '../lib/store';


@Component({
  selector: 'app-root',
  template: `
    <nav class="navbar navbar-light bg-faded">
      <ul class="nav navbar-nav">
        <li class="nav-item" routerLinkActive="active">
          <a class="nav-link" [routerLink]="['/welcome']">Welcome</a>
        </li>
        <li class="nav-item" routerLinkActive="active">
          <a class="nav-link" [routerLink]="['/profile']">Profile</a>
        </li>
      </ul>
    </nav>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent /*implements OnInit, OnDestroy*/ {
  // authUser: AuthUser | null;
  // firebaseUser: FirebaseUser | null;


  // constructor(
  //   private authService: AuthService,
  //   private firebaseService: FirebaseAuthService,
  //   private disposer: DisposerService,
  //   private store: Store,
  //   private cd: ChangeDetectorRef,
  // ) { }


  // ngOnInit() {
  //   this.disposer.registerWithToken(this,
  //     this.store.getState().subscribe(state => {
  //       this.authUser = state.authUser;
  //       this.firebaseUser = state.firebaseUser;
  //       this.cd.markForCheck();
  //     })
  //   );
  // }


  // ngOnDestroy() {
  //   this.disposer.disposeSubscriptions(this);
  // }

}
