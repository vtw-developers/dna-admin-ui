import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import {firstValueFrom} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {formatMessage} from "devextreme/localization";

export interface IUser {
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface IResponse {
  isOk: boolean;
  data?: IUser;
  message?: string;
}

const defaultPath = '/';

const defaultUser ={
  username: "",
  userAuth: "",
  rememberMe: false,
  tokenType: "",
  accessToken: "",
  avatarUrl: 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/01.png',
}

@Injectable()
export class AuthService {

  constructor(private router: Router, private http: HttpClient) {
    if(localStorage.getItem('user') == null){
      localStorage.setItem('user', JSON.stringify(defaultUser));
    }
  }
  get user() {
    return localStorage.getItem('user');
  }

  get loggedIn(): boolean {
    return !!this.user;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private _lastAuthenticatedPath: string = defaultPath;

  set lastAuthenticatedPath(value: string) {
    this._lastAuthenticatedPath = value;
  }

  async logIn(username: string, password: string, rememberMe: boolean) {
    try {
      // Send request
      return firstValueFrom(this.http.post('/dna/example/auth/signin', {
        username, password, rememberMe
      })).then(
        (response: any) => {
          if (response.accessToken) {
            localStorage.setItem('user', JSON.stringify(response));
          }
          return {
            isOk: true,
            data: this.user
          };
        },
        error => {
          console.log(error);
          if (error.error.message === 'lockedUser') {
            return {
              isOk: false,
              lockedUser: true,
              message: 'Locked User'
            };
          } else if (error.error.message === 'duplicateLogin') {
            return {
              isOk: false,
              lockedUser: false,
              duplicateLogin: true,
              message: 'DuplicateLogin User'
            }
          } else {
            return {
              isOk: false,
              lockedUser: false,
              message: 'Incorrect Information'
            };
          }
        });
    } catch {
      return {
        isOk: false,
        message: 'Authentication failed'
      };
    }
  }

  async createAccount(username: string, password: string, name: string, division: string, email: string, phone: string) {
    try {
      // Send request
      return firstValueFrom(this.http.post('/dna/example/auth/signup', {
        username, password, name, division, email, phone
      })).then(
        (result: any) => {
          // console.log(result);
          // this.user = result;
          return {
            isOk: true,
            data: this.user
          };
        },
        error => {
          console.log(error);
          return {
            isOk: false,
            message: formatMessage('AlreadyExistID')
          };
        });

      this.router.navigate(['/auth/create-account']);
      return {
        isOk: true
      };
    } catch {
      return {
        isOk: false,
        message: 'Failed to create account'
      };
    }
  }

  async updateAccount(id: number, username: string, password: string, name: string, division: string, email: string, phone: string) {
    try {
      return firstValueFrom(this.http.post('/dna/example/auth/update', {
        id, username, password, name, division, email, phone
      })).then(
        (result: any) => {
          return {
            isOk: true,
            data: this.user
          };
        },
        error => {
          console.log(error);
          return {
            isOk: false,
            message: 'Failed to update account'
          };
        });

      return {
        isOk: true,
      };
    } catch {
      return {
        isOk: false,
        message: 'Failed to update account',
      };
    }
  }

  async resetPassword(email: string) {
    try {
      // Send request

      return {
        isOk: true,
      };
    } catch {
      return {
        isOk: false,
        message: 'Failed to reset password',
      };
    }
  }

  async logOut() {
    const user = localStorage.getItem('user');
    const rememberMe = JSON.parse(user).rememberMe;

    return firstValueFrom(this.http.post('/dna/example/auth/logout', {
      username: JSON.parse(localStorage.getItem('user')).username
    })).then(
      (result: any) => {
        localStorage.setItem('user', JSON.stringify(defaultUser));
        if (rememberMe === false) {
          localStorage.removeItem('rememberId');
        }
        this.router.navigate(['/auth/login']);

        return {
          isOk: true,
          data: this.user
        };
      },
      error => {
        console.log(error);
        return {
          isOk: false,
          message: 'Logout Failed'
        };
      });
  }
}

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isLoggedIn = this.authService.loggedIn;
    const isAuthForm = [
      'login',
      'reset-password',
      'create-account',
      'change-password/:recoveryCode',
    ].includes(route.routeConfig?.path || defaultPath);

    if (!isLoggedIn && isAuthForm) {
      this.router.navigate(['/auth/login']);
    }

    if (isLoggedIn) {
      this.authService.lastAuthenticatedPath = route.routeConfig?.path || defaultPath;
    }

    return isLoggedIn || isAuthForm;
  }
}
