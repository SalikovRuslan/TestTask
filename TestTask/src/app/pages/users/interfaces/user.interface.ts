import { IUserList } from './user-list.interface';

export interface IUser extends IUserList {
  password: string;
}
