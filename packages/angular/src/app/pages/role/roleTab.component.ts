import {Component, Input, NgModule, ViewChild} from '@angular/core';
import 'devextreme/data/odata/store';
import {Apollo, gql} from "apollo-angular";
import DataSource from "devextreme/data/data_source";
import {PageableService} from '../../services/pageable.service';
import {
  DxButtonModule,
  DxDataGridComponent,
  DxDataGridModule, DxSelectBoxModule, DxTabsModule
} from "devextreme-angular";
import {CommonModule} from "@angular/common";
import CustomStore from "devextreme/data/custom_store";
import {firstValueFrom} from "rxjs";
import {UsersEditComponent, UsersEditModule} from "../user/edit/users-edit.component";
import {AuthorityEditComponent, AuthorityEditModule} from "../authority/edit/authority-edit.component";
import {Authority} from "../authority/authority.service";
import {confirm} from 'devextreme/ui/dialog';
import notify from "devextreme/ui/notify";
import {RoleAuthEditComponent, RoleAuthEditModule} from "./edit/roleAuth-edit.component";

@Component({
  selector: 'roleTab',
  providers: [PageableService],
  templateUrl: './roleTab.component.html',
})

// eslint-disable-next-line @angular-eslint/component-class-suffix
export class RoleTab {

  @Input() set selectedCurrentItem(currentItem) {
    this.currentItem = currentItem
    this.searchAuth();
  };
  roleDataList: DataSource;
  users: DataSource;
  currentItem: any;

  tabs = [
    {
      id: 0,
      text: '권한',
      icon: 'comment',
      content: 'content1',
    },
    {
      id: 1,
      text: '사용자',
      icon: 'user',
      content: 'content2',
    }
  ];

  @ViewChild(DxDataGridComponent, {static: false}) grid: DxDataGridComponent;
  @ViewChild(RoleAuthEditComponent, {static: false}) roleAuthEditPopup: RoleAuthEditComponent;

  constructor(private pageableService: PageableService, private apollo: Apollo) {
  }

  selectTab(e) {
    if (this.tabs[e.itemIndex].id == 0){
      this.searchAuth();

    } else if (this.tabs[e.itemIndex].id == 1){
      this.searchUser();
    }
  }

  searchAuth(){
    this.roleDataList = new DataSource({
      store: new CustomStore({
        key: 'id',
        load: (loadOptions) => {
          this.grid.instance.clearSelection();

          const pageable = this.pageableService.getPageable(loadOptions);
          pageable.filter = this.currentItem.id;

          const page$ = this.apollo.query({
            query: gql`
              query roleDataList(
                $page: Int = 0,
                $size: Int = 10,
                $sortBy: String = "id",
                $sortDir: String = "asc",
                $filter: String = "") {
                roleDataList(page: $page, size: $size, sortBy: $sortBy, sortDir: $sortDir, filter: $filter) {
                  totalElements
                  content {
                    id
                    authority{
                      id
                      name
                      detail
                    }
                    role{
                      id
                      name
                      detail
                      type
                      icon
                      expanded
                    }
                  }
                }
              }
            `,
            variables: {
              page: pageable.page,
              size: pageable.size,
              sortBy: pageable.sortBy,
              sortDir: pageable.sortDir,
              filter: pageable.filter
            }
          });

          return firstValueFrom(page$)
            .then((page: any) => {
              return this.pageableService.transformPage(page.data.roleDataList);
            });
        },
      })
    });
  }

  searchUser(){
    this.users = new DataSource({
      store: new CustomStore({
        key: 'id',
        load: (loadOptions) => {
          this.grid.instance.clearSelection();

          const pageable = this.pageableService.getPageable(loadOptions);
          pageable.filter = this.currentItem.id;

          const page$ = this.apollo.query({
            query: gql`
              query users(
                $page: Int = 0,
                $size: Int = 10,
                $sortBy: String = "id",
                $sortDir: String = "asc",
                $filter: String = "") {
                users(page: $page, size: $size, sortBy: $sortBy, sortDir: $sortDir, filter: $filter) {
                  totalElements
                  content {
                    id
                    userId
                  }
                }
              }
            `,
            variables: {
              page: pageable.page,
              size: pageable.size,
              sortBy: pageable.sortBy,
              sortDir: pageable.sortDir,
              filter: pageable.filter
            }
          });

          return firstValueFrom(page$)
            .then((page: any) => {
              return this.pageableService.transformPage(page.data.users);
            });
        },
      })
    });
  }

  createAuth(){
    this.roleAuthEditPopup.open();
  }

  deleteAuth= (e) => {
    const result = confirm('<i>권한을 삭제하시겠습니까?</i>', '삭제');
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
            id: e.row.data.id
          }
        }).subscribe({
          next: (v) => {
            notify('그룹 삭제가 완료되었습니다.', 'success', 3000);
            this.refresh();
          },
          error: (e) => {
            console.error(e);
            notify('그룹 삭제에 실패하였습니다.', 'error', 3000);
          }
        });
      }
    });
  }

  onSavedAuth(authority:Authority){
    this.refresh();
  }

  refresh () {
    this.roleDataList.reload();
    this.users.reload();
  }


}
@NgModule({
  imports: [
    DxButtonModule,
    DxDataGridModule,

    CommonModule,
    DxTabsModule,
    DxSelectBoxModule,

    UsersEditModule,
    AuthorityEditModule,
    RoleAuthEditModule,
  ],
  providers: [],
  exports: [
    RoleTab
  ],
  declarations: [RoleTab],
})
export class UsersTwoModule {
}
