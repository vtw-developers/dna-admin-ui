import {Component, NgModule, ViewChild} from '@angular/core';
import 'devextreme/data/odata/store';
import {Apollo, gql} from "apollo-angular";
import DataSource from "devextreme/data/data_source";
import {
  DxButtonModule,
  DxDataGridComponent,
  DxDataGridModule
} from "devextreme-angular";
import notify from "devextreme/ui/notify";
import {Authority} from "./authority.service";
import {AuthorityEditComponent, AuthorityEditModule} from "./edit/authority-edit.component";
import {CommonModule} from "@angular/common";
import {confirm} from "devextreme/ui/dialog";


@Component({
  templateUrl: './authority.component.html',
})
export class AuthorityComponent {
  authorities: DataSource
  authorityLists: DataSource
  name = "";
  id;
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
          }
        }
      `,
      variables: {
        name: this.name
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
        query authorityLists(
          $name: String) {
          authorityLists(name: $name) {
            id
            name
            userId
            userCompany
            registerDate
          }
        }
      `,
      variables: {
        name: this.name
      }
    }).subscribe({
      next: (result: any) => {
        this.authorityLists = result.data.authorityLists
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

  update= (e) =>{
    this.editPopup.open('update', e.row.data.id);
  }

  delete = (e) => {
    this.id = e.row.data.id;
    this.name = e.row.data.name;
    const result = confirm('<i>등록을 취소하시겠습니까?</i>','삭제');
    result.then(dialogResult => {
      if (dialogResult) {
        this.apollo.mutate({
          mutation: gql`
            mutation deleteAuthority($id: ID) {
              deleteAuthority(id: $id) {
                id
              }
            }
          `,
          variables: {
            id: this.id
          }
        }).subscribe({
          next: (v) => {
            this.name = "";
            this.search();
            this.searchUser();
            notify('권한이 삭제되었습니다.', 'success', 3000);
          },
          error: (e) => {
            console.error(e);
            notify('삭제를 실패하였습니다.', 'error', 3000);
          }
        });
      }
    });
  }

  deleteList = (e) =>{
    this.id = e.row.data.id;
    const result = confirm('<i>권한을 삭제하시겠습니까?</i>','삭제');
    result.then(dialogResult => {
      if (dialogResult) {
        this.apollo.mutate({
          mutation: gql`
            mutation deleteAuthorityList($id: ID) {
              deleteAuthorityList(id: $id) {
                id
              }
            }
          `,
          variables: {
            id: this.id
          }
        }).subscribe({
          next: (v) => {
            notify('등록이 취소되었습니다.', 'success', 3000);
            this.name = "";
            this.search();
            this.searchUser();
          },
          error: (e) => {
            console.error(e);
            notify('등록 취소에 실패하였습니다.', 'error', 3000);
          }
        });
      }
    });
  }

  onSaved(authority:Authority){
    this.refresh();
  }

  refresh = () => {
    this.name = "";
    this.search();
    this.searchUser();
  };
}

@NgModule({
  imports: [
    DxButtonModule,
    DxDataGridModule,

    CommonModule,
    AuthorityEditModule,
  ],
  providers: [],
  exports: [],
  declarations: [AuthorityComponent],
})
export class AuthorityModule {
}
