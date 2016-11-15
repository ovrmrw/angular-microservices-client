import { NgModule } from '@angular/core';

import { DisposerService } from './disposer.service';


@NgModule({
  providers: [
    DisposerService
  ],
  exports: [
    // DisposerService
  ]
})
export class DisposerModule { }
