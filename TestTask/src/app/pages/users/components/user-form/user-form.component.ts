import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { catchError, tap } from 'rxjs';

import { IUser } from '../../interfaces/user.interface';
import { UserTypeEnum } from '../../enums/user-type.enum';
import { IUserForm } from '../../interfaces/user-form.interface';
import { UsersService } from '../../services/users.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent implements OnInit {
  public formGroup: FormGroup<IUserForm>;
  public isCreation = true;
  public fullName = '';
  private initialUserName: string;

  constructor(
    private destroyRef: DestroyRef,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private usersService: UsersService,
  ) {}

  ngOnInit(): void {
    this.createUserForm();

    this.route.paramMap
      .pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
      const user: IUser = this.route.snapshot.data['user'];
      if (user) {
        this.initialUserName = user.username;
        this.formGroup.patchValue({
          ...user,
          repeatedPassword: user.password,
        });
        this.formGroup.updateValueAndValidity();
        this.updateHeaderFullName(user.firstName, user.lastName);
        this.isCreation = false;
      }
    })
  }

  public onSave(): void {
    (this.isCreation
        ? this.usersService.createUser(this.formGroup.value as IUser)
        : this.usersService.updateUser(this.formGroup.value as IUser, this.initialUserName)
    )
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          // show tooltip success
          console.log('success');

          const formValue = this.formGroup.value;
          this.initialUserName = formValue.username as string;
          this.updateHeaderFullName(formValue.firstName as string, formValue.lastName as string)
          this.isCreation = false;

          this.location.replaceState('/users/form/' + this.initialUserName);
          this.usersService.onReloadSubject$.next();
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.error === 'Already exist') {
            // show tooltip Already exist
            console.log(error.error)
          } else {
            // show tooltip backend error
            console.log(error.error)
          }
          throw error;
        })
      )
      .subscribe()
  }

  public onDelete(): void {
    this.usersService.deleteUser(this.initialUserName)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          // show tooltip success deleting
          console.log('success deleting');
          this.router.navigate(['/forms']).then();
          this.usersService.onReloadSubject$.next();
        })
      )
      .subscribe()

  }

  private createUserForm(): void {
    this.formGroup = new FormGroup<IUserForm>(<IUserForm>{
      username: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      userType: new FormControl(UserTypeEnum.Admin, [Validators.required]),
      password: new FormControl('', [Validators.required]),
      repeatedPassword: new FormControl('', [Validators.required]),
    });
  }

  private updateHeaderFullName(firstName: string, lastName: string): void {
    this.fullName = `${firstName} ${lastName}`;
  }
}