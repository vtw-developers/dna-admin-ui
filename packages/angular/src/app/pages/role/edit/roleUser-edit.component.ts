import {Component, EventEmitter, Output, NgModule, ViewChild, Input} from '@angular/core';
import notify from "devextreme/ui/notify";
import 'devextreme/data/odata/store';
import {Apollo, gql} from "apollo-angular";
import {Role} from "./role.service";
import {
  DxButtonModule, DxCheckBoxModule, DxDataGridComponent, DxDataGridModule, DxDateBoxModule,
  DxFormComponent,
  DxPopupComponent,
  DxPopupModule, DxSelectBoxModule,
  DxTextBoxModule,
  DxValidationGroupComponent,
  DxValidationGroupModule, DxValidationSummaryModule, DxValidatorModule,
  getElement
} from "devextreme-angular";
import {CommonModule} from "@angular/common";
import {
  DxiColumnModule,
  DxoPagerModule,
  DxoSearchPanelModule,
  DxoSelectionModule,
  DxoToolbarModule
} from "devextreme-angular/ui/nested";
import {Users} from "../../user/edit/users.service";
import {RoleUser} from "./roleUser.service";

@Component({
  selector: 'roleUser-edit-popup',
  templateUrl: './roleUser-edit.component.html',
})

export class RoleUserEditComponent {

  @Input() set selectedCurrentItem(currentItem) {
    this.currentItem = currentItem
  };

  popupVisible = false;
  currentItem: Role;
  usersList: Users[] =[];
  users: Users;
  roleUser: RoleUser;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onSaved = new EventEmitter<Role>();

  @ViewChild(DxFormComponent, {static: false}) form: DxFormComponent;
  @ViewChild(DxValidationGroupComponent, {static: false}) validationGroup: DxValidationGroupComponent;
  @ViewChild(DxPopupComponent, {static: false}) popup: DxPopupComponent;
  @ViewChild(DxDataGridComponent, {static: false}) grid: DxDataGridComponent;

  constructor(private apollo: Apollo) {
  }

  open() {
    this.validationGroup?.instance.reset();
    this.popupVisible = true;

    this.apollo.query({
      query: gql`
        query usersList($roleId: ID) {
          usersList(roleId: $roleId) {
            id
            userId
            name
          }
        }
      `,
      variables: {
        roleId: this.currentItem.id
      }
    }).subscribe({
      next: (result: any) => {
        this.usersList = result.data.usersList;
      },
      error: (e) => {
        console.error(e);
        notify('오류가 발생하였습니다.', 'error', 3000);
      }
    });
  }

  close() {
    this.popupVisible = false;
  }

  /** Popup Button Events */
  save = (e) => {
    e.preventDefault();
    this.close();

    this.roleUser = {
      id: null,
      users: this.users,
      role: this.currentItem
    }

    this.apollo.mutate({
      mutation: gql`
        mutation createRoleUser($roleUser: RoleUserInput) {
          createRoleUser(roleUser: $roleUser) {
            id
          }
        }
      `,
      variables: {
        roleUser: this.roleUser
      }
    }).subscribe({
      next: (result: any) => {
        console.log(result);
        notify('사용자가 등록되었습니다.', 'success', 3000);
        this.onSaved.emit(result.data.createRoleUser);
      },
      error: (e) => {
        console.error(e);
        notify('사용자 등록에 실패하였습니다.', 'error', 3000);
      }
    });
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
    DxDataGridModule,
    DxiColumnModule,
    DxoPagerModule,
    DxoSearchPanelModule,
    DxoSelectionModule,
    DxoToolbarModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
  providers: [],
  exports: [
    RoleUserEditComponent
  ],
  declarations: [RoleUserEditComponent],
})
export class RoleUserEditModule {
}
