import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';

import { Auth0Service, FirebaseUser } from '../../lib/auth';


@Component({
  selector: 'my-profile',
  template: `    
    <button *ngIf="!user" (click)="login()" class="btn btn-outline-primary">Log in</button>
    <button *ngIf="user" (click)="logout()" class="btn btn-outline-danger">Log out</button>
    <h2 *ngIf="!firebaseUser" class="display-4">Firebase Auth</h2>
    <h2 *ngIf="firebaseUser" class="display-4">Firebase Auth (カスタム認証)</h2>
    <div>
      <pre>{{firebaseUser | json}}</pre>
    </div>
    <h2 *ngIf="!user" class="display-4">Auth0</h2>
    <h2 *ngIf="user" class="display-4">Auth0 (provider: {{user?.identities[0].provider}})</h2>
    <div>
      <figure *ngIf="user" class="figure">
        <img [src]="user.picture" class="figure-img img-fluid rounded" alt="user picture" width=150 height=150>
        <figcaption class="figure-caption">picture of {{user.nickname || user.name}}</figcaption>
      </figure>
      <pre>{{user | json}}</pre>      
    </div>    
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnChanges {
  @Input()
  user: Auth0UserProfile | null;
  @Input()
  firebaseUser: FirebaseUser | null;


  constructor(
    private authService: Auth0Service,
  ) { }


  ngOnChanges(changes: SimpleChanges) {
    console.log('changes:', changes);
  }


  login(): void {
    this.authService.login();
  }


  async logout(): Promise<void> {
    await this.authService.logout();
    alert('You are now logged out');
  }

}
