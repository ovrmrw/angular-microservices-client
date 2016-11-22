import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';

import { AuthService, FirebaseAuthService } from '../../lib/auth';
import { AuthUser, FirebaseUser } from '../../lib/types';
import { DisposerService } from '../../lib/disposer';
import { Store } from '../../lib/store';


@Component({
  selector: 'welcome-page',
  template: `
    <h1 *ngIf="!isAuthed">Welcome (please log in)</h1>
    <h1 *ngIf="isAuthed">Welcome</h1>
    <hr />
    <!--<login-button></login-button>-->
    <profile-page></profile-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent implements OnInit, OnDestroy {
  isAuthed: boolean;

  constructor(
    private disposer: DisposerService,
    private store: Store,
    private cd: ChangeDetectorRef,
  ) { }


  ngOnInit() {
    this.disposer.registerWithToken(this,
      this.store.getState().subscribe(state => {
        this.isAuthed = state.isAuthed;
        this.cd.markForCheck();
      })
    );
  }


  ngOnDestroy() {
    this.disposer.disposeSubscriptions(this);
  }
}
