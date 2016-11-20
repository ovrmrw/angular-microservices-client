import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { GraphqlService } from './graphql.service';
import { Store, AppState, User } from '../../lib/store';
import { DisposerService } from '../../lib/disposer';


@Component({
  selector: 'graphql-page',
  template: `
    <div>
      <button (click)="request()" class="btn btn-outline-success">Request</button>
      <button (click)="clear()" class="btn btn-outline-warning">Clear</button>
    </div>
    <pre>{{users | json}}</pre>    
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphqlComponent implements OnInit, OnDestroy {
  users: User[];


  constructor(
    private service: GraphqlService,
    private store: Store,
    private disposer: DisposerService,
    private cd: ChangeDetectorRef,
  ) { }


  ngOnInit() {
    this.disposer.registerWithToken(this,
      this.store.getState().subscribe(state => {
        this.users = state.graphUsers;
        this.cd.markForCheck();
      })
    );
  }


  ngOnDestroy() {
    this.disposer.disposeSubscriptions(this);
  }


  request(): void {
    this.service.request();
  }


  clear(): void {
    this.service.clear();
  }

}
