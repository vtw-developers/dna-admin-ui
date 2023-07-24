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
import {confirm} from 'devextreme/ui/dialog';
import notify from "devextreme/ui/notify";
import {Menu} from "./menu.service";
import {MenuEditComponent, MenuEditModule} from "./edit/menu-edit.component";



@Component({
  templateUrl: './menu.component.html',
  providers: [PageableService],
})
export class MenuComponent {
  menus: DataSource;
  filter = '';
  @ViewChild(DxDataGridComponent, {static: false}) grid: DxDataGridComponent;
  @ViewChild(MenuEditComponent, {static: false}) editPopup: MenuEditComponent;

  constructor(private pageableService: PageableService, private apollo: Apollo) {
    this.menus = new DataSource({
      store: new CustomStore({
        key: 'id',
        load: (loadOptions) => {
          this.grid.instance.clearSelection();

          const pageable = this.pageableService.getPageable(loadOptions);
          const page$ = this.apollo.query({
            query: gql`
              query menus(
                $page: Int = 0,
                $size: Int = 10,
                $sortBy: String = "id",
                $sortDir: String = "asc",
                $filter: String = "") {
                menus(page: $page, size: $size, sortBy: $sortBy, sortDir: $sortDir, filter: $filter) {
                  totalElements
                  content {
                    id
                    name
                    detail
                    parentId
                    parentName
                    path
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
              return this.pageableService.transformPage(page.data.menus);
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
    const result = confirm('<i>권한을 삭제하시겠습니까?</i>', '삭제');
    result.then(dialogResult => {
      if (dialogResult) {
        this.apollo.mutate({
          mutation: gql`
            mutation deleteMenu($id: ID) {
              deleteMenu(id: $id) {
                id
              }
            }
          `,
          variables: {
            id: e.row.data.id
          }
        }).subscribe({
          next: (v) => {
            notify('삭제가 완료되었습니다.', 'success', 3000);
            this.refresh();
          },
          error: (e) => {
            console.error(e);
            notify('삭제에 실패하였습니다.', 'error', 3000);
          }
        });
      }
    });
  }

  onSaved(menu:Menu){
    this.refresh();
  }

  refresh() {
    this.menus.reload();
  }
}

@NgModule({
  imports: [
    DxButtonModule,
    DxDataGridModule,

    CommonModule,
    MenuEditModule,
    MenuEditModule,
  ],
  providers: [],
  exports: [],
  declarations: [MenuComponent],
})
export class MenuModule {
}
