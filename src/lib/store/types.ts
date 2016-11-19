import { FirebaseUser } from '../types';


export interface ViewerState {
  name: string;
  login: string;
}


export interface AppState {
  viewer?: ViewerState;
  authIdToken: string | null;
  authUser: Auth0UserProfile | null;
  firebaseUser: FirebaseUser | null;
}
