import {Component, EventEmitter, Output, NgModule, ViewChild} from '@angular/core';
import notify from "devextreme/ui/notify";
import 'devextreme/data/odata/store';
import {Apollo, gql} from "apollo-angular";
import {Users} from "./users.service";
import {
  DxButtonModule, DxDateBoxModule,
  DxFormComponent,
  DxPopupComponent,
  DxPopupModule, DxSelectBoxModule,
  DxTextBoxModule,
  DxValidationGroupComponent,
  DxValidationGroupModule, DxValidationSummaryModule, DxValidatorModule,
} from "devextreme-angular";
import {CommonModule} from "@angular/common";
import {formatMessage} from "devextreme/localization";
import {AuthService} from "../../../services";


@Component({
  selector: 'users-edit-popup',
  templateUrl: './users-edit.component.html',
})

export class UsersEditComponent {
  users: Users = {} as any;
  editMode: 'create' | 'update';
  popupVisible = false;
  loading = false;
  confirmedPassword;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onSaved = new EventEmitter<Users>();

  @ViewChild(DxFormComponent, {static: false}) form: DxFormComponent;
  @ViewChild(DxValidationGroupComponent, {static: false}) validationGroup: DxValidationGroupComponent;
  @ViewChild(DxPopupComponent, {static: false}) popup: DxPopupComponent;

  constructor(private authService: AuthService, private apollo: Apollo) {
  }

  open(editMode: 'create' | 'update', userId?: number) {
    this.validationGroup?.instance.reset();
    this.editMode = editMode;
    if(this.isUpdateMode()){
      this.apollo.query({
        query: gql`
          query user($id: ID) {
            user(id: $id) {
              id
              userId
              name
              division
              phone
              mail
            }
          }
        `,
        variables: {
          id: userId
        }
      }).subscribe({
        next: (result: any) => {
          this.users = result.data.user;
          this.users.password = null;
          this.popupVisible = true;
        },
        error: (e) => {
          console.error(e);
          notify('사용자 정보를 불러오는데 오류가 발생하였습니다.', 'error', 3000);
        }
      });
    } else {
      this.popupVisible = true;
      this.users = {id: null, userId: null, password: null, name: null, division: null, phone: null, mail: null, loginAttempts: null};
    }
  }

  close() {
    this.popupVisible = false;
  }

  isCreateMode() {
    return this.editMode === 'create';
  }

  isUpdateMode() {
    return this.editMode === 'update';
  }

  /** Popup Button Events */
  save = async (e) => {
    e.preventDefault();
    if (this.isCreateMode()) {
      this.loading = true;
      if (this.validationPassword(this.users.password)) {
        const result = await this.authService.createAccount(this.users.userId, this.users.password, this.users.name,
          this.users.division, this.users.mail, this.users.phone) as any
        this.loading = false;
        if (result.isOk) {
          this.close();
          notify(formatMessage('SignUpSuccessMessage'), 'success', 2000);
          this.onSaved.emit(this.users);
        } else {
          notify(result.message, 'error', 2000);
        }
      }
    } else {
      let isValidUpdate = true;
      if(this.users.password != null && !this.validationPassword(this.users.password)) {
        isValidUpdate = false;
      }
      if(isValidUpdate){
        const result = await this.authService.updateAccount(this.users.id, this.users.userId, this.users.password,
          this.users.name, this.users.division, this.users.mail, this.users.phone) as any
        this.loading = false;
        if (result.isOk) {
          this.close();
          notify('사용자 변경이 성공적으로 완료되었습니다.', 'success', 3000);
          this.onSaved.emit(this.users);
        } else {
          notify('사용자 변경에 실패하였습니다.', 'error', 3000);
        }
      }
    }
  }

  validationPassword(password: string) {
    let validationPass = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
    if (!validationPass.test(password) || password != this.confirmedPassword) {

      if (!validationPass.test(password)) {
        notify(formatMessage('validationPass'), 'error', 2000);
      }
      if (password != this.confirmedPassword) {
        notify(formatMessage('passwordDoNotMatch'), 'error', 2000);
      }
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
    DxPopupModule,
    DxValidationGroupModule,
    DxTextBoxModule,
    DxValidatorModule,
    DxValidationSummaryModule,
    DxButtonModule,
    DxDateBoxModule,
    DxSelectBoxModule,
  ],
  providers: [],
  exports: [
    UsersEditComponent
  ],
  declarations: [UsersEditComponent],
})
export class UsersEditModule {
}
