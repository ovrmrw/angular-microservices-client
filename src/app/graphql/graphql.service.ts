import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import ApolloClient, { createNetworkInterface } from 'apollo-client';

import { Store, Dispatcher, Action, RequestGraphUsersAction, ClearGraphUsersAction } from '../../lib/store';


const ENDPOINT = 'https://second-azure-functions.azurewebsites.net/api/graphql';
const FUNCTION_KEY = 'qj6WpLvHzcxAagjYWml9yZpaQyTnRgMuJYJvexRj4SWjfX83BqLvBg==';


const gqlQuery = gql`
  query {
    user (id: "1") {
      id
      name
      age
    }
  }
`;

const strQuery = `
  query {
    user (id: "1") {
      id
      name
      age
      address {
        zip
        street
      }
      hobby {
        id
        name
      }
      follow {
        id
        name
      }
    }
  }
`;


@Injectable()
export class GraphqlService {
  constructor(
    private http: Http,
    private dispatcher$: Dispatcher<Action>,
    private store: Store,
  ) { }


  async request(): Promise<void> {
    const state = await this.store.getState().take(1).toPromise();
    try {
      const headers = new Headers({
        'Authorization': 'Bearer ' + state.authIdToken,
        'x-functions-key': FUNCTION_KEY,
      });

      const result = await this.http.post(ENDPOINT, { query: strQuery }, { headers })
        .timeoutWith(1000 * 60, Observable.throw('request is timeout.'))
        .map(res => res.json().result as { data: any })
        .toPromise();
      console.log('request result:', result);
      if (result.data) {
        this.dispatcher$.next(new RequestGraphUsersAction(result.data));
      }
    } catch (err) {
      alert(err);
      throw new Error(err);
    }
  }


  clear(): void {
    this.dispatcher$.next(new ClearGraphUsersAction());
  }


  async requestApollo(): Promise<void> {
    try {
      const result = await new ApolloClient({
        networkInterface: await this.setNetworkInterface()
      }).query({
        query: gqlQuery
      });
      console.log('result:', result);
    } catch (err) {
      throw new Error(err);
    }
  }


  private async setNetworkInterface() {
    const state = await this.store.getState().take(1).toPromise();
    const networkInterface = createNetworkInterface({ uri: ENDPOINT });
    networkInterface.use([{
      applyMiddleware(req, next) {
        if (!req.options.headers) {
          req.options.headers = {};
        }
        req.options.headers['Authorization'] = `Bearer ${state.authIdToken}`;
        req.options.headers['x-functions-key'] = FUNCTION_KEY;
        next();
      }
    }]);
    return networkInterface;
  }

}
