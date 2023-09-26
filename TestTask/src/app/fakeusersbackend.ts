import { Injectable } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';

@Injectable()
export class FakeBackendHttpInterceptor implements HttpInterceptor {
  private usersJsonPath = "assets/users.json";
  constructor(private http: HttpClient) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.handleRequests(req, next);
  }
  handleRequests(req: HttpRequest<any>, next: HttpHandler): any {
    const { url, method } = req;
    if (url.endsWith("/users") && method === "GET") {
      req = req.clone({
        url: this.usersJsonPath,
      });
      return next.handle(req).pipe(delay(500));
    }
    if (url.endsWith("/users") && method === "POST") {
      const { body } = req.clone();
      // assign a new uuid to new employee
      return of(new HttpResponse({ status: 200, body })).pipe(delay(500));
    }
    if (url.match(/\/users\/.*/) && method === "DELETE") {
      const empId = this.getEmployeeId(url);
      return of(new HttpResponse({ status: 200, body: empId })).pipe(
        delay(500)
      );
    }
    // if there is not any matches return default request.
    return next.handle(req);
  }

  getEmployeeId(url: any) {
    const urlValues = url.split("/");
    return urlValues[urlValues.length - 1];
  }
}

export let fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendHttpInterceptor,
  multi: true,
};
