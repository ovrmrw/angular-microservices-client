import { User } from './types';
import { FirebaseUser } from '../types';


export class NextAuthIdTokenAction {
  constructor(public idToken: string | null) { }
}

export class NextAuthUserProfileAction {
  constructor(public user: Auth0UserProfile | null) { }
}

export class NextFirebaseUserProfileAction {
  constructor(public user: FirebaseUser | null) { }
}

export class LogoutAction {
  constructor() { }
}

export class RequestGraphUsersAction {
  constructor(public users: User[]) { }
}

export class ClearGraphUsersAction {
  constructor() { }
}


export type Action =
  NextAuthIdTokenAction | NextAuthUserProfileAction | NextFirebaseUserProfileAction |
  LogoutAction |
  RequestGraphUsersAction | ClearGraphUsersAction
  ;
