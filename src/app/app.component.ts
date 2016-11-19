import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { AuthService, FirebaseAuthService } from '../lib/auth';
import { AuthUser, FirebaseUser } from '../lib/types';
import { DisposerService } from '../lib/disposer';
import { Store } from '../lib/store';


@Component({
  selector: 'app-root',
  template: `
    <my-profile [authUser]="authUser" [firebaseUser]="firebaseUser"></my-profile>
  `,
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  authUser: AuthUser | null;
  firebaseUser: FirebaseUser | null;


  constructor(
    private authService: AuthService,
    private firebaseService: FirebaseAuthService,
    private disposer: DisposerService,
    private store: Store,
    private cd: ChangeDetectorRef,
  ) { }


  ngOnInit() {
    this.disposer.add =
      this.store.getState().subscribe(async (state) => {
        this.authUser = state.authUser;
        this.firebaseUser = state.firebaseUser;
        this.cd.markForCheck();
        if (this.authUser && this.firebaseUser) {
          await this.firebaseService.writeUserProfile(this.authUser, this.firebaseUser);
          console.log('writeUserProfile is successed.');
        }
      });
  }


  ngOnDestroy() {
    this.disposer.disposeSubscriptions();
  }

}
