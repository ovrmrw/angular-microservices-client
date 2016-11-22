import { NgModule } from '@angular/core';

import { Dispatcher, createDispatcher } from './common';
import { Store } from './store';
import { AuthGuard } from './auth-guard.service';


@NgModule({
  providers: [
    { provide: Dispatcher, useFactory: createDispatcher },
    Store,
    AuthGuard,
  ],
})
export class StoreModule {
  constructor() {
    console.log('='.repeat(20), 'StoreModule', '='.repeat(20));
  }
}
