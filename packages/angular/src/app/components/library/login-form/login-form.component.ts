import { CommonModule } from '@angular/common';
import { Component, NgModule, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { LoginOauthModule } from 'src/app/components/library/login-oauth/login-oauth.component';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import notify from 'devextreme/ui/notify';
import { AuthService, IResponse, ThemeService } from 'src/app/services';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  @Input() resetLink = '/auth/reset-password';
  @Input() createAccountLink = '/auth/create-account';

  defaultAuthData: IResponse;

  btnStylingMode: string;

  loading = false;

  formData: any = {};
  username;
  password;

  constructor(private authService: AuthService, private router: Router, private themeService: ThemeService) {
    this.isRememberMe();
    this.themeService.isDark.subscribe((value: boolean) => {
      this.btnStylingMode = value ? 'outlined' : 'contained';
    });

    const user = localStorage.getItem('user');
    const username = JSON.parse(user).username;
    if(username != "") {
      this.router.navigate(['/menu']);
    }
  }

  // changePasswordMode() {
  //   debugger;
  //   this.passwordMode = this.passwordMode === 'text' ? 'password' : 'text';
  // };

  async onSubmit(e: Event) {
    e.preventDefault();
    const { username, password, rememberMe } = this.formData;
    this.loading = true;

    if(rememberMe === true) {
      localStorage.setItem('rememberId', username);
    }

    const result = await this.authService.logIn(username, password, rememberMe) as any;

    if (!result.isOk) {
      this.loading = false;
      notify(result.message, 'error', 2000);
    } else {
      this.router.navigate(['/menu']);
    }
  }

  onCreateAccountClick = () => {
    this.router.navigate([this.createAccountLink]);
  };

  isRememberMe() {
    if(localStorage.getItem('rememberId') !== null) {
      this.username = localStorage.getItem('rememberId');
    }
  }

  // async ngOnInit(): Promise<void> {
  //   this.defaultAuthData = await this.authService.getUser();
  // }
}
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LoginOauthModule,
    DxFormModule,
    DxLoadIndicatorModule,
    DxButtonModule
  ],
  declarations: [LoginFormComponent],
  exports: [LoginFormComponent],
})
export class LoginFormModule { }
