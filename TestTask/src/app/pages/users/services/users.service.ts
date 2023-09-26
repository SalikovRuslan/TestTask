import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { IUserList } from '../interfaces/user-list.interface';
import { IUserListResponse } from '../interfaces/user-list-response';

@Injectable()
export class UsersService {

  constructor(private httpClient: HttpClient) { }

  public getUsers(): Observable<IUserList[]> {
    return this.httpClient.get<IUserListResponse[]>('http://localhost:4200/users')
      .pipe(
        map(response => this.castUsersListModel(response))
      );
  }

  private castUsersListModel(usersResponse: IUserListResponse[]): IUserList[] {
    return usersResponse.map(item => ({
      username: item.username,
      firstName: item.first_name,
      lastName: item.last_name,
      email: item.email,
      userType: item.user_type,
    }));
  }
}
