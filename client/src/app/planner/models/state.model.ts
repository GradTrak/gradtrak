import { UserData } from './user-data.model';

export class State {
  loading: boolean;
  loggedIn: boolean;
  username: string;
  userData: UserData;
}
