import {Component, EventEmitter, Output, NgModule, ViewChild} from '@angular/core';
import notify from "devextreme/ui/notify";
import 'devextreme/data/odata/store';
import {Apollo, gql} from "apollo-angular";
import {Role} from "./role.service";
import {
  DxButtonModule, DxCheckBoxModule, DxDataGridComponent, DxDataGridModule, DxDateBoxModule,
  DxFormComponent,
  DxPopupComponent,
  DxPopupModule,
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

@Component({
  selector: 'roleGroup-edit-popup',
  templateUrl: './roleGroup-edit.component.html',
})

export class RoleGroupEditComponent {
  role: Role = {} as any;
  editMode: 'create' | 'update';
  popupVisible = false;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onSaved = new EventEmitter<Role>();

  @ViewChild(DxFormComponent, {static: false}) form: DxFormComponent;
  @ViewChild(DxValidationGroupComponent, {static: false}) validationGroup: DxValidationGroupComponent;
  @ViewChild(DxPopupComponent, {static: false}) popup: DxPopupComponent;
  @ViewChild(DxDataGridComponent, {static: false}) grid: DxDataGridComponent;

  constructor(private apollo: Apollo) {
  }

  open(editMode: 'create' | 'update', id?: any) {
    this.validationGroup?.instance.reset();
    this.editMode = editMode;
    if(this.isUpdateMode()){
      this.apollo.query({
        query: gql`
          query role($id: ID) {
            role(id: $id) {
              id
              name
              detail
            }
          }
        `,
        variables: {
          id: id
        }
      }).subscribe({
        next: (result: any) => {
          this.role = result.data.role;
          this.popupVisible = true;
        },
        error: (e) => {
          console.error(e);
          notify('직원 정보를 불러오는데 오류가 발생하였습니다.', 'error', 3000);
        }
      });
    } else {
      this.popupVisible = true;
      this.role = {id: null, name: null, detail: null, type: null, expanded: null, icon: null};
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
      this.role.type = 'Template';
      this.role.icon = 'template';
      this.role.expanded = true;
      this.apollo.mutate({
        mutation: gql`
          mutation createRole($role: RolesInput) {
            createRole(role: $role) {
              id
            }
          }
        `,
        variables: {
          role: this.role
        }
      }).subscribe({
        next: (result: any) => {
          notify('권한이 생성되었습니다.', 'success', 3000);
          this.onSaved.emit(result.data.createRole);
        },
        error: (e) => {
          console.error(e);
          notify('권한 생성에 실패하였습니다.', 'error', 3000);
        }
      });
    } else {
      this.apollo.mutate({
        mutation: gql`
          mutation updateRole($role: RolesInput) {
            updateRole(role: $role) {
              id
            }
          }
        `,
        variables: {
          role: this.role
        }
      }).subscribe({
        next: (result: any) => {
          notify('권한이 변경되었습니다.', 'success', 3000);
          this.onSaved.emit(result.data.updateRole);
        },
        error: (e) => {
          console.error(e);
          notify('권한 변경에 실패하였습니다.', 'error', 3000);
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
    DxDataGridModule,
    DxiColumnModule,
    DxoPagerModule,
    DxoSearchPanelModule,
    DxoSelectionModule,
    DxoToolbarModule,
    DxCheckBoxModule,
  ],
  providers: [],
  exports: [
    RoleGroupEditComponent
  ],
  declarations: [RoleGroupEditComponent],
})
export class RoleEditModule {
}
