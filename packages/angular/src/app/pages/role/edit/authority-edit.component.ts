import {Component, EventEmitter, Output, NgModule, ViewChild} from '@angular/core';
import notify from "devextreme/ui/notify";
import 'devextreme/data/odata/store';
import {Apollo, gql} from "apollo-angular";
import {Authority} from "./authority.service";
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
import DataSource from "devextreme/data/data_source";
import {Users} from "./users.service";


@Component({
  selector: 'authority-edit-popup',
  templateUrl: './authority-edit.component.html',
})

export class AuthorityEditComponent {
  authorities: DataSource;
  authority: Authority = {} as any;
  editMode: 'create' | 'update';
  popupVisible = false;
  authorityList : string[] = [];
  user: Users;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onSaved = new EventEmitter<Authority>();

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
          query authority($id: ID) {
            authority(id: $id) {
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
          this.authority = result.data.authority;
          this.popupVisible = true;
        },
        error: (e) => {
          console.error(e);
          notify('권한 정보를 불러오는데 실패하였습니다.', 'error', 3000);
        }
      });
    } else {
      this.popupVisible = true;
      this.authority = {id: null, name: null, detail: null};
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
          mutation createAuthority($authority: AuthorityInput) {
            createAuthority(authority: $authority) {
              id
            }
          }
        `,
        variables: {
          authority: this.authority
        }
      }).subscribe({
        next: (result: any) => {
          notify('권한이 생성되었습니다.', 'success', 3000);
          this.onSaved.emit(result.data.createAuthority);
        },
        error: (e) => {
          console.error(e);
          notify('권한 생성에 실패하였습니다.', 'error', 3000);
        }
      });
    } else {
      this.apollo.mutate({
        mutation: gql`
          mutation updateAuthority($authority: AuthorityInput) {
            updateAuthority(authority: $authority) {
              id
            }
          }
        `,
        variables: {
          authority: this.authority
        }
      }).subscribe({
        next: (result: any) => {
          notify('권한이 변경되었습니다.', 'success', 3000);
          this.onSaved.emit(result.data.updateEmployee);
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
    AuthorityEditComponent
  ],
  declarations: [AuthorityEditComponent],
})
export class AuthorityEditModule {
}
