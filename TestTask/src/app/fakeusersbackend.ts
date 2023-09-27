import { Injectable } from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { map, Observable, of, tap } from 'rxjs';

import { IUserResponse } from './pages/users/interfaces/user-response.interface';

@Injectable()
export class FakeBackendHttpInterceptor implements HttpInterceptor {
  private usersJsonPath = "assets/users.json";

  private users: IUserResponse[] = [];
  constructor(private http: HttpClient) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.handleRequests(req, next);
  }
  handleRequests(req: HttpRequest<any>, next: HttpHandler): any {
    const { url, method } = req;
    // get all
    if (url.endsWith('/users') && method === 'GET') {
      req = req.clone({
        url: this.usersJsonPath,
      });
      return this.users.length
          ? of(new HttpResponse({ status: 200, body: this.users }))
          : this.http.get<any[]>(req.url).pipe(
              tap(users => this.users = users),
              map(() => new HttpResponse({ status: 200, body: this.users }))
          );
    }

    // add new
    if (url.match(/\/users\/.*/) && method === 'POST') {
      const { body } = req.clone();
      if (this.users.find(item => item.username === body.username)) {
        throw new HttpErrorResponse({ status: 400, error: 'Already exist' });
      }
      this.users = [body, ...this.users];
      return of(new HttpResponse({ status: 201, body: body.username }));
    }

    // edit
    if (url.match(/\/users\/.*/) && method === 'PUT') {
      const { body } = req.clone();
      if (!this.users.find(item => item.username === body.oldUsername)) {
        throw new HttpErrorResponse({ status: 400, error: 'Not exist' });
      }

      if (body.username !== body.oldUsername && this.users.find(item => item.username === body.username)) {
        throw new HttpErrorResponse({ status: 400, error: 'Already exist' });
      }

      this.users = this.users.map(item => {
        if (item.username === body.oldUsername) {
          delete body.oldUsername;
          return { ...body }
        }
        return item;
      });
      return of(new HttpResponse({ status: 200, body: body.username }));
    }

    // delete
    if (url.match(/\/users\/.*/) && method === 'DELETE') {
      const username = this.getUsername(url);
      this.users = this.users.filter(item => item.username !== username);

      return of(new HttpResponse({ status: 200, body: username }));
    }

    // get one
    if (url.match(/\/users\/.*/) && method === "GET") {
      req = req.clone({
        url: this.usersJsonPath,
      });
      return (this.users.length ? of(this.users) : this.http.get<any[]>(req.url))
        .pipe(
          tap(users => this.users = users),
          map(() => {
            const username = this.getUsername(url);
            const user = this.users.find(item => item.username === username);

            if (!user) {
              throw new HttpErrorResponse({ status: 404, error: 'not found' });
            }

            return new HttpResponse({ status: 200, body: user });
          })
        );
    }

    // if there is not any matches return default request.
    return next.handle(req);
  }

  getUsername(url: any) {
    const urlValues = url.split("/");
    return urlValues[urlValues.length - 1];
  }
}

export let fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendHttpInterceptor,
  multi: true,
};
