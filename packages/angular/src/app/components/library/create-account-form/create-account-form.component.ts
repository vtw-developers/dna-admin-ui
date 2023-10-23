import { CommonModule } from '@angular/common';
import { Component, NgModule, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { LoginOauthModule } from 'src/app/components/library/login-oauth/login-oauth.component';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import notify from 'devextreme/ui/notify';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'app-create-account-form',
  templateUrl: './create-account-form.component.html',
  styleUrls: ['./create-account-form.component.scss'],
})
export class CreateAccountFormComponent {
  @Input() redirectLink = '/auth/login';
  @Input() buttonLink = '/auth/login';
  loading = false;

  formData: any = {};
  username;
  password;
  confirmedPassword;
  name;
  division;
  email;
  phone;

  constructor(private authService: AuthService, private router: Router) { }

  async onSubmit(e: Event) {
    e.preventDefault();
    const { username, password, confirmedPassword, name, division, email, phone } = this.formData;
    this.loading = true;

    if (this.validationPassword(this.formData.password)) {
      const result = await this.authService.createAccount(username, password, name, division, email, phone) as any
      this.loading = false;
      if (result.isOk) {
        this.router.navigate(['/auth/login']);
        notify('계정이 생성되었습니다.', 'success', 3000);
      } else {
        notify(result.message, 'error', 2000);
      }
    }
  }

  validationPassword(password: string) {
    let validationPass = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
    if (!validationPass.test(password) || this.formData.password != this.formData.confirmedPassword) {

      if (!validationPass.test(password)) {
        notify('비밀번호는 영문, 숫자, 특수문자를 조합한 8자리 이상으로 만들어 주세요.', 'error', 3000);
      }
      if (this.formData.password != this.formData.confirmedPassword) {
        notify('비밀번호 확인란이 일치하지 않습니다', 'error', 3000);
      }
      this.formData.password = null;
      this.confirmedPassword = null;
      this.loading = false;
      return false;
    }
    return true;
  }
}
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LoginOauthModule,
    DxFormModule,
    DxLoadIndicatorModule,
  ],
  declarations: [CreateAccountFormComponent],
  exports: [CreateAccountFormComponent],
})
export class CreateAccountFormModule { }
