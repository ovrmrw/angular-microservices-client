import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';

import { AuthService } from '../../lib/auth';
import { AuthUser, FirebaseUser } from '../../lib/types';


@Component({
  selector: 'my-profile',
  template: `    
    <button *ngIf="!authUser" (click)="login()" class="btn btn-outline-primary">Log in</button>
    <button *ngIf="authUser" (click)="logout()" class="btn btn-outline-danger">Log out</button>
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
export class ProfileComponent implements OnChanges {
  @Input()
  authUser: AuthUser | null;
  @Input()
  firebaseUser: FirebaseUser | null;


  constructor(
    private authService: AuthService,
  ) { }


  ngOnChanges(changes: SimpleChanges) {
    console.log('changes:', changes);
  }


  login(): void {
    this.authService.login();
  }


  async logout(): Promise<void> {
    await this.authService.logout();
    setTimeout(() => {
      alert('Log out');
    }, 100);
  }

}
