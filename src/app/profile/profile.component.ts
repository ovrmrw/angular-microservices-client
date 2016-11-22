import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';

import { AuthService } from '../../lib/auth';
import { AuthUser, FirebaseUser } from '../../lib/types';
import { Store } from '../../lib/store';
import { DisposerService } from '../../lib/disposer';


@Component({
  selector: 'profile-page',
  template: `
    <div *ngIf="!(authUser && firebaseUser)">    
      <h2>Firebase Auth</h2>
      <pre>{{nullValue | json}}</pre>
    </div>
    <div *ngIf="authUser && firebaseUser">
      <h2>Firebase Auth (カスタム認証)</h2>
      <pre>{{firebaseUser | json}}</pre>
    </div>

    <div *ngIf="!authUser"> 
      <h2>Auth0</h2>
      <pre>{{nullValue | json}}</pre>
    </div>
    <div *ngIf="authUser"> 
      <h2>Auth0 (provider: {{authUser?.identities[0].provider}})</h2>
      <figure class="figure">
        <img [src]="authUser.picture" class="figure-img img-fluid rounded" alt="user picture" width=150 height=150>
        <figcaption class="figure-caption">picture of {{authUser.screen_name || authUser.nickname || authUser.name}}</figcaption>
      </figure>
      <pre>{{authUser | json}}</pre>
    </div>    
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit, OnDestroy {
  authUser: AuthUser | null;
  firebaseUser: FirebaseUser | null;
  nullValue = null;;


  constructor(
    private authService: AuthService,
    private store: Store,
    private disposer: DisposerService,
    private cd: ChangeDetectorRef,
  ) { }


  ngOnInit() {
    this.disposer.registerWithToken(this,
      this.store.getState().subscribe(state => {
        this.authUser = state.authUser;
        this.firebaseUser = state.firebaseUser;
        this.cd.markForCheck();
      })
    );
  }


  ngOnDestroy() {
    this.disposer.disposeSubscriptions(this);
  }

}
