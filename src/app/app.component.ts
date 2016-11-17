import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';

import { Auth0Service } from '../lib/auth';
import { DisposerService } from '../lib/disposer';


@Component({
  selector: 'app-root',
  template: `
    <my-profile [user]="user"></my-profile>
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
    this.disposer.add =
      this.authService.currentUserProfile$.subscribe(user => {
        this.user = user;
        this.cd.markForCheck();
      });
  }


  ngOnDestroy() {
    this.disposer.disposeSubscriptions();
  }

}
