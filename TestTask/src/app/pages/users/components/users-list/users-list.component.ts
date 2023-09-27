import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { EMPTY, Observable, startWith, switchMap, tap } from 'rxjs';

import { IUserList } from '../../interfaces/user-list.interface';
import { UsersService } from '../../services/users.service';
import { UserTypeEnum } from '../../enums/user-type.enum';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent implements OnInit {
  public users$: Observable<IUserList[]> = new Observable();
  public selectedUsername: string;

  protected readonly UserTypeEnum = UserTypeEnum;

  constructor(
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.users$ = this.usersService.onReloadSubject$
      .pipe(
        startWith(EMPTY),
        tap(() => this.checkCurrentSelectedUser()),
        switchMap(() => this.usersService.getUsers())
      );
  }

  private checkCurrentSelectedUser() {
    this.selectedUsername = location.href.split('/')?.pop() || '';
  }
}
