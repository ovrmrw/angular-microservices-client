import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';

import { AuthService } from '../../lib/auth';
import { AuthUser, FirebaseUser } from '../../lib/types';
import { Store } from '../../lib/store';
import { DisposerService } from '../../lib/disposer';


@Component({
  selector: 'profile-page',
  template: `   
    <h2 *ngIf="!firebaseUser">Firebase Auth</h2>
    <h2 *ngIf="firebaseUser">Firebase Auth (カスタム認証)</h2>
    <div>
      <pre>{{firebaseUser | json}}</pre>
    </div>
    <h2 *ngIf="!authUser">Auth0</h2>
    <h2 *ngIf="authUser">Auth0 (provider: {{authUser?.identities[0].provider}})</h2>
    <div>
      <figure *ngIf="authUser" class="figure">
        <img [src]="authUser.picture" class="figure-img img-fluid rounded" alt="user picture" width=150 height=150>
        <figcaption class="figure-caption">picture of {{authUser.screen_name || authUser.nickname || authUser.name}}</figcaption>
      </figure>
      <pre>{{authUser | json}}</pre>      
    </div>    
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit, OnDestroy {
  // @Input()
  authUser: AuthUser | null;
  // @Input()
  firebaseUser: FirebaseUser | null;


  constructor(
    private authService: AuthService,
    private store: Store,
    private disposer: DisposerService,
    private cd: ChangeDetectorRef,
  ) { }


  // ngOnChanges(changes: SimpleChanges) {
  //   console.log('changes:', changes);
  // }

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


  // login(): void {
  //   this.authService.login();
  // }


  // async logout(): Promise<void> {
  //   await this.authService.logout();
  //   setTimeout(() => {
  //     alert('Log out');
  //   }, 100);
  // }

}
