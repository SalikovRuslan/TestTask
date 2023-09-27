import { ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UsersService } from '../services/users.service';
import { catchError, EMPTY, Observable } from 'rxjs';
import { SnackbarService } from '@shared/services/snackbar.service';

export const userResolver: ResolveFn<Observable<any>> = (route, state) => {
  const usersService = inject(UsersService);
  const snackbarService = inject(SnackbarService);
  const router = inject(Router);
  const username = route.params['username'];

  return usersService.getUser(username)
      .pipe(
          catchError(() => {
            snackbarService.warning('This user doesnt exist');
            router.navigate(['/users']).then();
            return EMPTY;
          })
      );
};
