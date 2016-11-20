import { Dispatcher, StateReducer, NonStateReducer } from './common';
import { User } from './types';
import { AuthUser, FirebaseUser } from '../types';
import { AUTH_ID_TOKEN, AUTH_PROFILE } from '../const';
import {
  Action,
  NextAuthIdTokenAction, NextAuthUserProfileAction, NextFirebaseUserProfileAction,
  RequestGraphUsersAction, ClearGraphUsersAction,
  LogoutAction,
} from './actions';


export const authIdTokenStateReducer: StateReducer<string | null> =
  (initState: string | null, dispatcher$: Dispatcher<Action>) =>
    dispatcher$.scan((state, action) => {
      if (action instanceof NextAuthIdTokenAction) {
        if (action.idToken) {
          localStorage.setItem(AUTH_ID_TOKEN, action.idToken);
        } else {
          localStorage.removeItem(AUTH_ID_TOKEN);
        }
        return action.idToken;
      } else if (action instanceof LogoutAction) {
        localStorage.removeItem(AUTH_ID_TOKEN);
        return initState;
      } else {
        return state;
      }
    }, initState);


export const authUserStateReducer: StateReducer<AuthUser | null> =
  (initState: AuthUser | null, dispatcher$: Dispatcher<Action>) =>
    dispatcher$.scan((state, action) => {
      if (action instanceof NextAuthUserProfileAction) {
        if (action.user) {
          localStorage.setItem(AUTH_PROFILE, JSON.stringify(action.user));
        } else {
          localStorage.removeItem(AUTH_PROFILE);
        }
        return action.user;
      } else if (action instanceof LogoutAction) {
        localStorage.removeItem(AUTH_PROFILE);
        return initState;
      } else {
        return state;
      }
    }, initState);


export const firebaseUserStateReducer: StateReducer<FirebaseUser | null> =
  (initState: FirebaseUser | null, dispatcher$: Dispatcher<Action>) =>
    dispatcher$.scan((state, action) => {
      if (action instanceof NextFirebaseUserProfileAction) {
        return action.user;
      } else if (action instanceof LogoutAction) {
        return initState;
      } else {
        return state;
      }
    }, initState);


export const graphUserStateReducer: StateReducer<User[]> =
  (initState: User[], dispatcher$: Dispatcher<Action>) =>
    dispatcher$.scan<User[]>((state, action) => {
      if (action instanceof RequestGraphUsersAction) {
        return action.users;
      } else if (action instanceof LogoutAction || action instanceof ClearGraphUsersAction) {
        return initState;
      } else {
        return state;
      }
    }, initState);
