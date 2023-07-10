import {Component, NgModule, ViewChild} from '@angular/core';
import 'devextreme/data/odata/store';
import {Apollo, gql} from "apollo-angular";
import DataSource from "devextreme/data/data_source";
import {
  DxButtonModule,
  DxDataGridComponent,
  DxDataGridModule
} from "devextreme-angular";
import {CommonModule} from "@angular/common";
import CustomStore from "devextreme/data/custom_store";
import {firstValueFrom} from "rxjs";
import {PageableService} from "../../services/pageable.service";
import {RoleEditComponent, RoleEditModule} from "./edit/role-edit.component";
import {Role} from "./edit/role.service";
import {confirm} from 'devextreme/ui/dialog';
import notify from "devextreme/ui/notify";


@Component({
  templateUrl: './roleGroup.component.html',
  providers: [PageableService],
})
export class RoleGroupComponent {
  roles: DataSource
  filter = '';
  @ViewChild(DxDataGridComponent, {static: false}) grid: DxDataGridComponent;
  @ViewChild(RoleEditComponent, {static: false}) editPopup: RoleEditComponent;

  constructor(private pageableService: PageableService, private apollo: Apollo) {
    this.roles = new DataSource({
      store: new CustomStore({
        key: 'id',
        load: (loadOptions) => {
          this.grid.instance.clearSelection();

          const pageable = this.pageableService.getPageable(loadOptions);
          pageable.filter = this.filter;

          const page$ = this.apollo.query({
            query: gql`
              query roles(
                $page: Int = 0,
                $size: Int = 10,
                $sortBy: String = "id",
                $sortDir: String = "asc",
                $filter: String = "") {
                roles(page: $page, size: $size, sortBy: $sortBy, sortDir: $sortDir, filter: $filter) {
                  totalElements
                  content {
                    id
                    name
                    detail
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
              return this.pageableService.transformPage(page.data.roles);
            });
        },
      })
    });
  }

  create(){
    this.editPopup.open('create');
  }

  update= (e) =>{
    this.editPopup.open('update', e.row.data.id);
  }

  delete = (e) => {
    // @ts-ignore
    const result = confirm('<i>그룹을 삭제하시겠습니까?</i>', '삭제');
    result.then(dialogResult => {
      if (dialogResult) {
        this.apollo.mutate({
          mutation: gql`
            mutation deleteRole($id: ID) {
              deleteRole(id: $id) {
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
            this.search();
          },
          error: (e) => {
            console.error(e);
            notify('그룹 삭제에 실패하였습니다.', 'error', 3000);
          }
        });
      }
    });
  }

  onSaved(role: Role){
    this.search();
  }

  search() {
    this.roles.reload();
  }
}

@NgModule({
  imports: [
    DxButtonModule,
    DxDataGridModule,

    CommonModule,
    RoleEditModule,
  ],
  providers: [],
  exports: [],
  declarations: [RoleGroupComponent],
})
export class RoleGroupModule {
}
