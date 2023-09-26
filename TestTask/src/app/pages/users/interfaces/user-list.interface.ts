import { UserTypeEnum } from '../enums/user-type.enum';

export interface IUserList {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: UserTypeEnum;
}
