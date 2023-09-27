import { IUserListResponse } from './user-list-response';

export interface IUserResponse extends IUserListResponse {
  oldUsername?: string;
  password: string;
}
