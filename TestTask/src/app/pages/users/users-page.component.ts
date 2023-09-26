import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
