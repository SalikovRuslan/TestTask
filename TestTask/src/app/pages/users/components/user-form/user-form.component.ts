import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { catchError, tap } from 'rxjs';

import { createPasswordStrengthValidator } from '@shared/validators/create-password-strength.validator';
import { confirmPasswordValidator } from '@shared/validators/confirm-password.validator';
import { ISelectValue } from '@shared/components/ui-select/ui-select.component';
import { SnackbarService } from '@shared/services/snackbar.service';

import { IUser } from '../../interfaces/user.interface';
import { UserTypeEnum } from '../../enums/user-type.enum';
import { IUserForm } from '../../interfaces/user-form.interface';
import { UsersService } from '../../services/users.service';


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
  public selectValues: ISelectValue[] = [
    { value: UserTypeEnum.Admin, title: 'Administrator' },
    { value: UserTypeEnum.Driver, title: 'Driver' },
  ];

  private initialUserName: string;

  constructor(
    private destroyRef: DestroyRef,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private usersService: UsersService,
    private snackbarService: SnackbarService,
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

        this.isCreation = false;
        this.updateHeaderFullName(user.firstName, user.lastName);
        this.cdr.markForCheck();
      }
    })

    this.formGroup.get('password')?.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => {
        const repeatedPasswordControl = this.formGroup.get('repeatedPassword');
        if (value && repeatedPasswordControl?.value) {
          repeatedPasswordControl?.markAsTouched();
          repeatedPasswordControl?.markAsDirty();
          repeatedPasswordControl?.updateValueAndValidity();
        }
      })
  }

  public onSave(): void {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    (this.isCreation
        ? this.usersService.createUser(this.formGroup.value as IUser)
        : this.usersService.updateUser(this.formGroup.value as IUser, this.initialUserName)
    )
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.snackbarService.success(this.isCreation ? 'Created' : 'Updated');

          const formValue = this.formGroup.value;
          this.initialUserName = formValue.username as string;
          this.updateHeaderFullName(formValue.firstName as string, formValue.lastName as string)
          this.isCreation = false;

          this.location.replaceState('/users/form/' + this.initialUserName);
          this.usersService.onReloadSubject$.next();
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.error === 'Already exist') {
            this.snackbarService.warning('Username must be unique');
          } else {
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
          this.snackbarService.success('Deleted');
          this.router.navigate(['/users']).then();
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
      email: new FormControl('', [Validators.required, Validators.email]),
      userType: new FormControl(UserTypeEnum.Admin, [Validators.required]),
      password: new FormControl('',
        [Validators.minLength(8), createPasswordStrengthValidator()]
      ),
      repeatedPassword: new FormControl('',
        [Validators.required, confirmPasswordValidator('password')]
      ),
    });
  }

  private updateHeaderFullName(firstName: string, lastName: string): void {
    this.fullName = `${firstName} ${lastName}`;
  }
}
