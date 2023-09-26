import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { IUserList } from '../../interfaces/user-list.interface';
import { UsersService } from '../../services/users.service';
import { UserTypeEnum } from '../../enums/user-type.enum';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  public users$: Observable<IUserList[]> = new Observable();

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.users$ = this.usersService.getUsers();
  }

  protected readonly UserTypeEnum = UserTypeEnum;
}
