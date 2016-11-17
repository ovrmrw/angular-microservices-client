import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';

import { Auth0Service } from '../../lib/auth';

@Component({
  selector: 'my-profile',
  template: `
    <button *ngIf="!user" (click)="login()">Log in</button>
    <button *ngIf="user" (click)="logout()">Log out</button>
    <pre>{{user | json}}</pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnChanges {
  @Input()
  user: Auth0UserProfile | null;


  constructor(
    private authService: Auth0Service,
  ) { }


  ngOnChanges(changes: SimpleChanges) { }


  login() {
    this.authService.login();
  }


  logout() {
    this.authService.logout();
  }

}
