import { Injectable, Inject } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { Store } from './store';
import { WELCOME_PAGE, AppKind } from '../const';


@Injectable()
export class AuthGuard implements CanActivate {
  isAuthed: boolean;


  constructor(
    private store: Store,
    private router: Router,
    @Inject(AppKind)
    private appKind: string,
  ) {
    this.store.getState().subscribe(state => {
      this.isAuthed = state.isAuthed;
    });
  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.isAuthed) {
      return true;
    } else {
      alert('You are not signed in.');
      if (this.appKind === 'web') {
        this.router.navigate(['/' + WELCOME_PAGE]);
      }
      return false;
    }
  }

}
