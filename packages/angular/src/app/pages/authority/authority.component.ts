import {Component, Input, NgModule, ViewChild} from '@angular/core';
import 'devextreme/data/odata/store';
import {Apollo, gql} from "apollo-angular";
import DataSource from "devextreme/data/data_source";
import {ActivatedRoute, Router} from "@angular/router";
import {firstValueFrom} from 'rxjs';
import {
  DxButtonModule,
  DxDataGridComponent,
  DxDataGridModule,
  DxDropDownButtonModule, DxSelectBoxModule, DxTextBoxModule,
  getElement
} from "devextreme-angular";
import notify from "devextreme/ui/notify";
import {Authority} from "./authority.service";
import {AuthorityEditComponent, AuthorityEditModule} from "./edit/authority-edit.component";
import {ContactPanelModule} from "../../components/library/contact-panel/contact-panel.component";
import {ExtractNewFormModule} from "../../components/library/dna/extract-new-form/extract-new-form.component";
import {CardActivitiesModule, ContactStatusModule, FormPopupModule} from "../../components";
import {CommonModule} from "@angular/common";


@Component({
  templateUrl: './authority.component.html',
})

export class AuthorityComponent {
  authorities: DataSource
  users: DataSource
  name;
  authority: Authority = {} as any;
  @ViewChild(DxDataGridComponent, {static: false}) grid: DxDataGridComponent;
  @ViewChild(AuthorityEditComponent, {static: false}) editPopup: AuthorityEditComponent;

  constructor(private apollo: Apollo) {
    this.search();
  }

  search() {
    this.apollo.query({
      query: gql`
        query authorities(
          $name: String) {
          authorities(name: $name) {
            id
            name
            detail
            registerDate
          }
        }
      `,
      variables: {
        name: ""
      }
    }).subscribe({
      next: (result: any) => {
        this.authorities = result.data.authorities
      },
      error: (e) => {
        console.error(e);
        notify('오류가 발생하였습니다.', 'error', 3000);
      }
    });
  }

  searchUser(){
    this.name = this.grid?.instance.getSelectedRowKeys()[0].name;
    this.apollo.query({
      query: gql`
        query users(
          $name: String) {
          users(name: $name) {
            userId
            userCompany
          }
        }
      `,
      variables: {
        name: this.name
      }
    }).subscribe({
      next: (result: any) => {
        console.log(result.data.users);
        this.users = result.data.users
      },
      error: (e) => {
        console.error(e);
        notify('오류가 발생하였습니다.', 'error', 3000);
      }
    });
  }

  create(){
    this.editPopup.open('create');
  }

  delete(){

  }
  onSaved(authority:Authority){
    this.search();
  }
}

@NgModule({
  imports: [
    DxButtonModule,
    DxDataGridModule,
    DxDropDownButtonModule,
    DxSelectBoxModule,
    DxTextBoxModule,

    ContactPanelModule,
    ExtractNewFormModule,
    FormPopupModule,
    CardActivitiesModule,
    ContactStatusModule,

    CommonModule,
    AuthorityEditModule,
  ],
  providers: [],
  exports: [],
  declarations: [AuthorityComponent],
})
export class AuthorityModule {
}
