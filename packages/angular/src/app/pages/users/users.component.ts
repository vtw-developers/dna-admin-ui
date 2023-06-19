import {Component, NgModule, ViewChild} from '@angular/core';
import 'devextreme/data/odata/store';
import {Apollo, gql} from "apollo-angular";
import DataSource from "devextreme/data/data_source";
import {PageableService} from '../../services/pageable.service';
import {
  DxButtonModule,
  DxDataGridComponent,
  DxDataGridModule
} from "devextreme-angular";
import {CommonModule} from "@angular/common";

import {firstValueFrom} from "rxjs";
import {UsersEditComponent, UsersEditModule} from "./edit/users-edit.component";
import {Users} from "./users.service";
import CustomStore from "devextreme/data/custom_store";
import {confirm} from "devextreme/ui/dialog";
import notify from "devextreme/ui/notify";


@Component({
  providers: [PageableService],
  templateUrl: './users.component.html',
})
export class UsersComponent {
  users: DataSource;
  filter = '';
  id;

  @ViewChild(DxDataGridComponent, {static: false}) grid: DxDataGridComponent;
  @ViewChild(DxDataGridComponent, {static: false}) gridInner: DxDataGridComponent;
  @ViewChild(UsersEditComponent, {static: false}) editPopup: UsersEditComponent;

  constructor(private pageableService: PageableService, private apollo: Apollo) {
    this.search();
  }

  search(){
    this.users = new DataSource({
      store: new CustomStore({
        key: 'id',
        load: (loadOptions) => {
          this.grid.instance.clearSelection();

          const pageable = this.pageableService.getPageable(loadOptions);
          pageable.filter = this.filter;

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
                    company
                    phone
                    authority
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
        }
      })
    })
  }

  create(){
    this.editPopup.open('create');
  }

  delete = (e) => {
    this.id = e.row.data.id;
    const result = confirm('<i>사용자를 삭제하시겠습니까?</i>','삭제');
    result.then(dialogResult => {
      if (dialogResult) {
        this.apollo.mutate({
          mutation: gql`
            mutation deleteUsers($id: ID) {
              deleteUsers(id: $id) {
                id
              }
            }
          `,
          variables: {
            id: this.id
          }
        }).subscribe({
          next: (v) => {
            this.search();
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

  update(){

  }

  onSaved(users:Users){
    this.refresh();
  }

  refresh = () => {
    this.search();
  }
}

@NgModule({
  imports: [
    DxButtonModule,
    DxDataGridModule,

    CommonModule,
    UsersEditModule,
  ],
  providers: [],
  exports: [],
  declarations: [UsersComponent],
})
export class UsersModule {
}
