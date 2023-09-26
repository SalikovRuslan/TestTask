import { UserTypeEnum } from '../enums/user-type.enum';

export interface IUserListResponse {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: UserTypeEnum;
}
