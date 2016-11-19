import { ViewerState } from './types';
import { FirebaseUser } from '../types';

export class RequestViewerAction {
  constructor(public viewer: ViewerState) { }
}

export class NextAuthIdToken {
  constructor(public idToken: string | null) { }
}

export class NextAuthUserProfile {
  constructor(public user: Auth0UserProfile | null) { }
}

export class NextFirebaseUserProfile {
  constructor(public user: FirebaseUser | null) { }
}


export type Action =
  NextAuthIdToken | NextAuthUserProfile | NextFirebaseUserProfile
  ;
