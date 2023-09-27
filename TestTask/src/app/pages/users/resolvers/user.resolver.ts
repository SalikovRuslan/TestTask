import { ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UsersService } from '../services/users.service';
import { catchError, EMPTY, Observable } from 'rxjs';

export const userResolver: ResolveFn<Observable<any>> = (route, state) => {
  const usersService = inject(UsersService);
  const router = inject(Router);
  const username = route.params['username'];

  return usersService.getUser(username)
      .pipe(
          catchError(() => {
            // show error tooltip
            router.navigate(['/users']).then();
            return EMPTY;
          })
      );
};
