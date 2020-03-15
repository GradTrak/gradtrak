import { UserData } from 'models/user-data.model';

export class State {
  loading: boolean;
  loggedIn: boolean;
  username: string;
  userData: UserData;
}
