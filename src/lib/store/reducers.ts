import { Dispatcher, StateReducer, NonStateReducer } from './common';
import { ViewerState } from './types';
import { AuthUser, FirebaseUser } from '../types';
import { AUTH_ID_TOKEN, AUTH_PROFILE } from '../const';
import {
  Action,
  RequestViewerAction,
  NextAuthIdToken, NextAuthUserProfile, NextFirebaseUserProfile,
} from './actions';


export const viewerStateReducer: StateReducer<ViewerState> =
  (initState: ViewerState, dispatcher$: Dispatcher<Action>) =>
    dispatcher$.scan((state, action) => {
      if (action instanceof RequestViewerAction) {
        return action.viewer;
      } else {
        return state;
      }
    }, initState);


export const authIdTokenStateReducer: StateReducer<string | null> =
  (initState: string | null, dispatcher$: Dispatcher<Action>) =>
    dispatcher$.scan((state, action) => {
      if (action instanceof NextAuthIdToken) {
        if (action.idToken) {
          localStorage.setItem(AUTH_ID_TOKEN, action.idToken);
        } else {
          localStorage.removeItem(AUTH_ID_TOKEN);
        }
        return action.idToken;
      } else {
        return state;
      }
    }, initState);


export const authUserStateReducer: StateReducer<AuthUser | null> =
  (initState: AuthUser | null, dispatcher$: Dispatcher<Action>) =>
    dispatcher$.scan((state, action) => {
      if (action instanceof NextAuthUserProfile) {
        if (action.user) {
          localStorage.setItem(AUTH_PROFILE, JSON.stringify(action.user));
        } else {
          localStorage.removeItem(AUTH_PROFILE);
        }
        return action.user;
      } else {
        return state;
      }
    }, initState);


export const firebaseUserStateReducer: StateReducer<FirebaseUser | null> =
  (initState: FirebaseUser | null, dispatcher$: Dispatcher<Action>) =>
    dispatcher$.scan((state, action) => {
      if (action instanceof NextFirebaseUserProfile) {
        return action.user;
      } else {
        return state;
      }
    }, initState);
