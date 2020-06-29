import { UserData } from './user-data.model';

export type AuthType = 'local' | 'google';

export class State {
  loggedIn: boolean;
  user: {
    username: string;
    auth: AuthType;
  };

  userData: UserData;
}
