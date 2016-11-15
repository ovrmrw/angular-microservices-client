import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Auth0Service } from '../lib/auth';
import { DisposerService } from '../lib/disposer';


@Component({
  selector: 'app-root',
  // templateUrl: './app.component.html',
  template: `
    <button *ngIf="!user" (click)="login()">Log in</button>
    <button *ngIf="user" (click)="logout()">Log out</button>
    <pre>{{user | json}}</pre>
  `,
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'app works!';
  user: Auth0UserProfile | null;


  constructor(
    private authService: Auth0Service,
    private disposer: DisposerService,
    private cd: ChangeDetectorRef,
  ) { }


  ngOnInit() {
    this.disposer.disposeSubscriptions().register(
      this.authService.currentUserProfile$.subscribe(user => {
        this.user = user;
        this.cd.markForCheck();
      })
    );
  }


  login() {
    this.authService.login();
  }


  logout() {
    this.authService.logout();
  }

}
