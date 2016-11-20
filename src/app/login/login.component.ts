import { Component, Input, OnChanges, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';

import { AuthService } from '../../lib/auth';
import { AuthUser, FirebaseUser } from '../../lib/types';
import { Store } from '../../lib/store';
import { DisposerService } from '../../lib/disposer';


@Component({
  selector: 'login-button',
  template: `    
    <button *ngIf="!loginState" (click)="login()" class="btn btn-outline-primary">Log in</button>
    <button *ngIf="loginState" (click)="logout()" class="btn btn-outline-danger">Log out</button>        
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
  loginState = false;


  constructor(
    private authService: AuthService,
    private store: Store,
    private disposer: DisposerService,
    private cd: ChangeDetectorRef,
  ) { }


  ngOnInit() {
    this.disposer.registerWithToken(this,
      this.store.getState().subscribe(state => {
        if (state.authIdToken && state.authUser) {
          this.loginState = true;
        } else {
          this.loginState = false;
        }
        this.cd.markForCheck();
      })
    );
  }


  ngOnDestroy() {
    this.disposer.disposeSubscriptions(this);
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
