import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPageComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }

  public onCreateClick() {
    this.router.navigate(['form'], { relativeTo: this.route }).then();
  }
}
