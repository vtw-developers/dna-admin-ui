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
import {RoleAuth} from "./roleAuth.service";
import {Authority} from "../../authority/authority.service";

@Component({
  selector: 'roleAuth-edit-popup',
  templateUrl: './roleAuth-edit.component.html',
})

export class RoleAuthEditComponent {

  @Input() set selectedCurrentItem(currentItem) {
    this.currentItem = currentItem
  };

  popupVisible = false;
  currentItem: Role;
  authorityList: Authority[] =[];
  authority: Authority;
  roleAuth: RoleAuth;

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
        query authorityList($roleId: ID) {
          authorityList(roleId: $roleId) {
            id
            name
            detail
          }
        }
      `,
      variables: {
        roleId: this.currentItem.id
      }
    }).subscribe({
      next: (result: any) => {
        this.authorityList = result.data.authorityList;
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

    this.roleAuth = {
      id: null,
      authority: this.authority,
      role: this.currentItem
    }

    this.apollo.mutate({
      mutation: gql`
        mutation createRoleAuth($roleAuth: RoleAuthInput) {
          createRoleAuth(roleAuth: $roleAuth) {
            id
          }
        }
      `,
      variables: {
        roleAuth: this.roleAuth
      }
    }).subscribe({
      next: (result: any) => {
        console.log(result);
        notify('권한이 등록되었습니다.', 'success', 3000);
        this.onSaved.emit(result.data.createRoleAuth);
      },
      error: (e) => {
        console.error(e);
        notify('권한 등록에 실패하였습니다.', 'error', 3000);
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
    RoleAuthEditComponent
  ],
  declarations: [RoleAuthEditComponent],
})
export class RoleAuthEditModule {
}
