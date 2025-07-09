declare module 'passport-linkedin-oauth2-raviga' {
  import { Strategy as PassportStrategy } from 'passport';

  export interface Profile {
    id: string;
    displayName: string;
    name?: {
      familyName?: string;
      givenName?: string;
    };
    emails?: Array<{ value: string }>;
    photos?: Array<{ value: string }>;
    provider: string;
    _raw: string;
    _json: any;
  }

  export interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
    state?: boolean;
    passReqToCallback?: boolean;
    profileFields?: string[];
  }

  export type VerifyFunction =
    | ((accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) => void)
    | ((
        req: any,
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: any, user?: any) => void
      ) => void);

  export class Strategy extends PassportStrategy {
    constructor(options: StrategyOptions, verify: VerifyFunction);
  }
}