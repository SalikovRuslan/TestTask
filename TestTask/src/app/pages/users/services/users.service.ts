import { Injectable } from '@angular/core';
import { map, Observable, Subject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { IUserList } from '../interfaces/user-list.interface';
import { IUserListResponse } from '../interfaces/user-list-response';
import { IUser } from '../interfaces/user.interface';
import { IUserResponse } from '../interfaces/user-response.interface';

@Injectable()
export class UsersService {
  public onReloadSubject$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  public createUser(user: IUser): Observable<void> {
    const request = this.castUserToServerModel(user);
    return this.httpClient.post<void>('http://localhost:4200/users/', request);
  }

  public updateUser(user: IUser, oldUsername: string): Observable<void> {
    const request = this.castUpdateUserToServerModel(user, oldUsername);
    return this.httpClient.put<void>('http://localhost:4200/users/', request);
  }

  public deleteUser(username: string): Observable<void> {
    return this.httpClient.delete<void>('http://localhost:4200/users/' + username);
  }

  public getUsers(): Observable<IUserList[]> {
    return this.httpClient.get<IUserListResponse[]>('http://localhost:4200/users')
      .pipe(
        map(response => this.castUsersListModel(response))
      );
  }

  public getUser(username: string): Observable<IUser> {
    return this.httpClient.get<IUserResponse>('http://localhost:4200/users/' + username)
        .pipe(
            map(response => this.castUserModel(response)),
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

  private castUserModel(usersResponse: IUserResponse): IUser {
    return {
      username: usersResponse.username,
      firstName: usersResponse.first_name,
      lastName: usersResponse.last_name,
      email: usersResponse.email,
      userType: usersResponse.user_type,
      password: usersResponse.password,
    }
  }

  private castUserToServerModel(user: IUser): IUserResponse {
    return {
      username: user.username,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      user_type: user.userType,
      password: user.password,
    }
  }

  private castUpdateUserToServerModel(user: IUser, oldUsername: string): IUserResponse {
    return {
      oldUsername: oldUsername,
      username: user.username,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      user_type: user.userType,
      password: user.password,
    }
  }
}
