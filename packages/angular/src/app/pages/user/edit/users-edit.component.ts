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
  getElement
} from "devextreme-angular";
import {CommonModule} from "@angular/common";
import DataSource from "devextreme/data/data_source";


@Component({
  selector: 'users-edit-popup',
  templateUrl: './users-edit.component.html',
})

export class UsersEditComponent {
  users: Users = {} as any;
  editMode: 'create' | 'update';
  popupVisible = false;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onSaved = new EventEmitter<Users>();

  @ViewChild(DxFormComponent, {static: false}) form: DxFormComponent;
  @ViewChild(DxValidationGroupComponent, {static: false}) validationGroup: DxValidationGroupComponent;
  @ViewChild(DxPopupComponent, {static: false}) popup: DxPopupComponent;

  constructor(private apollo: Apollo) {
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
              password
              name
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
          this.popupVisible = true;
        },
        error: (e) => {
          console.error(e);
          notify('사용자 정보를 불러오는데 오류가 발생하였습니다.', 'error', 3000);
        }
      });
    } else {
      this.popupVisible = true;
      this.users = {id: null, userId: null, password: null, name: null, phone: null, mail: null};
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
  save = (e) => {
    e.preventDefault();
    this.close();
    if (this.isCreateMode()) {
      this.apollo.mutate({
        mutation: gql`
          mutation createUsers($users: UsersInput) {
            createUsers(users: $users) {
              id
            }
          }
        `,
        variables: {
          users: this.users
        }
      }).subscribe({
        next: (result: any) => {
          notify('사용자가 등록되었습니다.', 'success', 3000);
          this.onSaved.emit(result.data.createUsers);
        },
        error: (e) => {
          console.error(e);
          notify('사용자 등록에 실패하였습니다.', 'error', 3000);
        }
      });
    } else {
      this.apollo.mutate({
        mutation: gql`
          mutation updateUsers($users: UsersInput) {
            updateUsers(users: $users) {
              id
            }
          }
        `,
        variables: {
          users: this.users
        }
      }).subscribe({
        next: (result: any) => {
          notify('사용자 변경이 성공적으로 완료되었습니다.', 'success', 3000);
          this.onSaved.emit(result.data.updateUsers);
        },
        error: (e) => {
          console.error(e);
          notify('사용자 변경에 실패하였습니다.', 'error', 3000);
        }
      });
    }
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
