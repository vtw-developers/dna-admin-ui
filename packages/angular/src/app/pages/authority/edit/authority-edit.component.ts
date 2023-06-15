import {Component, EventEmitter, Output, NgModule, ViewChild} from '@angular/core';
import notify from "devextreme/ui/notify";
import 'devextreme/data/odata/store';
import {Apollo, gql} from "apollo-angular";
import {Authority} from "../authority.service";
import {
  DxButtonModule, DxDateBoxModule,
  DxFormComponent,
  DxPopupComponent,
  DxPopupModule,
  DxTextBoxModule,
  DxValidationGroupComponent,
  DxValidationGroupModule, DxValidationSummaryModule, DxValidatorModule,
  getElement
} from "devextreme-angular";
import {CommonModule} from "@angular/common";


@Component({
  selector: 'authority-edit-popup',
  templateUrl: './authority-edit.component.html',
})

export class AuthorityEditComponent {
  authority: Authority = {} as any;
  editMode: 'create' | 'update';
  popupVisible = false;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onSaved = new EventEmitter<Authority>();

  @ViewChild(DxFormComponent, {static: false}) form: DxFormComponent;
  @ViewChild(DxValidationGroupComponent, {static: false}) validationGroup: DxValidationGroupComponent;
  @ViewChild(DxPopupComponent, {static: false}) popup: DxPopupComponent;

  constructor(private apollo: Apollo) {
  }

  open(editMode: 'create' | 'update', authorityId?: number) {
    this.validationGroup?.instance.reset();
    this.editMode = editMode;
    this.popupVisible = true;
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
  ],
  providers: [],
  exports: [
    AuthorityEditComponent
  ],
  declarations: [AuthorityEditComponent],
})
export class AuthorityEditModule {
}
