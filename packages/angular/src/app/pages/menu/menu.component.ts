import {Component, NgModule, ViewChild} from '@angular/core';
import 'devextreme/data/odata/store';
import {Apollo, gql} from "apollo-angular";
import DataSource from "devextreme/data/data_source";
import {
  DxButtonModule,
  DxTreeListComponent, DxTreeListModule
} from "devextreme-angular";
import {CommonModule} from "@angular/common";
import {confirm} from 'devextreme/ui/dialog';
import notify from "devextreme/ui/notify";
import {Menu} from "./menu.service";
import {MenuEditComponent, MenuEditModule} from "./edit/menu-edit.component";



@Component({
  templateUrl: './menu.component.html',
})
export class MenuComponent {
  menus: DataSource;
  filter = '';
  @ViewChild(DxTreeListComponent, {static: false}) grid: DxTreeListComponent;
  @ViewChild(MenuEditComponent, {static: false}) editPopup: MenuEditComponent;

  constructor(private apollo: Apollo) {
    this.searchMenu();
  }

  searchMenu(){
    this.apollo.query({
      query: gql`
        query menuList($name: String) {
          menuList(name: $name) {
            id
            name
            detail
            parentId
            parentName
            path
            type
            icon
            expanded
          }
        }
      `,
      variables: {
        name: ''
      }
    }).subscribe({
      next: (result: any) => {
        this.menus = result.data.menuList;
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
    const result = confirm('<i>메뉴를 삭제하시겠습니까?</i>', '삭제');
    result.then(dialogResult => {
      if (dialogResult) {
        this.apollo.mutate({
          mutation: gql`
            mutation deleteMenu($menu: MenuInput) {
              deleteMenu(menu: $menu) {
                id
              }
            }
          `,
          variables: {
            menu: e.row.data
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
    this.searchMenu();
  }
}

@NgModule({
  imports: [
    DxButtonModule,

    CommonModule,
    MenuEditModule,
    MenuEditModule,
    DxTreeListModule,
  ],
  providers: [],
  exports: [],
  declarations: [MenuComponent],
})
export class MenuModule {
}
