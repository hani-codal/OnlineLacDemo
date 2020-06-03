import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { UserData } from './userData.model';
import { Router } from '@angular/router';


export interface AuthInterface {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }
  user = new BehaviorSubject<UserData>(null);
  userLogout: any;

  signUp(email: string, password: string) {

    return this.http.post<AuthInterface>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBZ06bpiQ35MDM7XYN45IiUMKGrp7X0oJk',
      {
        email: email,
        password: password,
        returnSecureToken: true
      })
      .pipe(catchError(this.handleError), tap(responseData => {
        this.handleAuth(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn)
      }));
  }
  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.userLogout) {
      clearTimeout(this.userLogout)
    }
    this.userLogout = null;
  }

  logIn(email: string, password: string) {
    return this.http.post<AuthInterface>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBZ06bpiQ35MDM7XYN45IiUMKGrp7X0oJk',
      {
        email: email,
        password: password,
        returnSecureToken: true
      })
      .pipe(catchError(this.handleError), tap(responseData => {
        this.handleAuth(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn)
      }));
  }
  autoLogin() {
    const user: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));
    if (!user) {
      return;
    }
    const loggedUser = new UserData(user.email, user.id, user._token, new Date(user._tokenExpirationDate));
    if (loggedUser.token) {
      this.user.next(loggedUser);
      const expiredDate = new Date(user._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expiredDate);
    }

  }
  autoLogout(expirationDate: number) {
    console.log(expirationDate)
    this.userLogout = setTimeout(() => {
      this.logout();
    }, expirationDate);
  }

  private handleAuth(email: string, id: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new UserData(email, id, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMsg = "An Error Occured!";
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMsg);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_NOT_FOUND':
        errorMsg = "this email not exists";
        break;
      case 'INVALID_PASSWORD':
        errorMsg = "invalid password";
        break;
      case 'EMAIL_EXISTS':
        errorMsg = "this email is already exists";
        break;
    }
    return throwError(errorMsg);
  }
}

