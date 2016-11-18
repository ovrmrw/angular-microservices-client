import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Auth0Service, FirebaseAuthService } from '../lib/auth';
import { DisposerService } from '../lib/disposer';


@Component({
  selector: 'app-root',
  template: `
    <my-profile [user]="user" [firebaseUser]="firebaseUser"></my-profile>
  `,
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app works!';
  user: Auth0UserProfile | null;
  firebaseUser: any;

  constructor(
    private authService: Auth0Service,
    private firebaseService: FirebaseAuthService,
    private disposer: DisposerService,
    private cd: ChangeDetectorRef,
  ) { }


  ngOnInit() {
    this.disposer.register(
      Observable.combineLatest(
        this.authService.currentUserProfile$,
        this.firebaseService.currentUser$
      ).subscribe(users => {
        this.user = users[0];
        this.firebaseUser = users[1];
        this.cd.markForCheck();
        this.cd.detectChanges();
        if (this.user && this.firebaseUser) {
          this.firebaseService.writeUserProfile(this.user);
        }
      })
    );
  }


  ngOnDestroy() {
    this.disposer.disposeSubscriptions();
  }

}
