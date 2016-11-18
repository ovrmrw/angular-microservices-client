import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Auth0Service } from '../../lib/auth';


@Component({
  selector: 'my-profile',
  template: `
    <button *ngIf="!user" (click)="login()">Log in</button>
    <button *ngIf="user" (click)="logout()">Log out</button>
    <h2 *ngIf="!firebaseUser">Firebase Auth</h2>
    <h2 *ngIf="firebaseUser">Firebase Auth (カスタム認証)</h2>
    <div>
      <pre>{{firebaseUser | json}}</pre>
    </div>
    <h2 *ngIf="!user">Auth0</h2>
    <h2 *ngIf="user">Auth0 (provider: {{user?.identities[0].provider}})</h2>
    <div>
      <img *ngIf="user" [src]="user.picture" width=100 height=100 />
      <pre>{{user | json}}</pre>      
    </div>    
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnChanges {
  @Input()
  user: Auth0UserProfile | null;
  @Input()
  firebaseUser: any;

  constructor(
    private authService: Auth0Service,
    // private cd: ChangeDetectorRef,
  ) { }


  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    // this.cd.markForCheck();
  }


  login() {
    this.authService.login();
  }


  logout() {
    this.authService.logout();
  }

}
