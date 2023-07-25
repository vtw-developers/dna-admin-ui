import {Component, Input, NgModule, ViewChild} from '@angular/core';
import 'devextreme/data/odata/store';
import {Apollo, gql} from "apollo-angular";
import DataSource from "devextreme/data/data_source";
import {
  DxButtonModule,
  DxTreeListComponent, DxTreeListModule
} from "devextreme-angular";
import {CommonModule} from "@angular/common";
import notify from "devextreme/ui/notify";
import {RoleMenu} from "./roleMenu.service";

@Component({
  selector: 'role-menu-inner',
  templateUrl: './role-menu-inner.component.html',
})
export class RoleMenuInnerComponent {

  @Input() set selectedCurrentItem(currentItem) {
    this.currentItem = currentItem
    this.searchRoleMenu();
  };
  menuList: DataSource;
  selectedMenus: Number[] = [];
  currentItem: any;
  roleMenuList: RoleMenu[] = [];
  @ViewChild(DxTreeListComponent, {static: false}) grid: DxTreeListComponent;

  constructor(private apollo: Apollo) {
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
        this.menuList = result.data.menuList
      },
      error: (e) => {
        console.error(e);
        notify('예매 정보를 불러오는데 오류가 발생하였습니다.', 'error', 3000);
      }
    });
  }

  searchRoleMenu(){
    this.apollo.query({
      query: gql`
        query roleMenuList($roleId: Int) {
          roleMenuList(roleId: $roleId)
        }
      `,
      variables: {
        roleId: parseInt(this.currentItem.id)
      }
    }).subscribe({
      next: (result: any) => {
        this.roleMenuList = result.data.roleMenuList
      },
      error: (e) => {
        console.error(e);
        notify('예매 정보를 불러오는데 오류가 발생하였습니다.', 'error', 3000);
      }
    });
  }

  create(){
    this.apollo.mutate({
      mutation: gql`
        mutation createRoleMenu($role: RolesInput, $menuList: [MenuInput]) {
          createRoleMenu(role: $role, menuList: $menuList,) {
            id
          }
        }
      `,
      variables: {
        role: this.currentItem,
        menuList: this.selectedMenus
      }
    }).subscribe({
      next: (result: any) => {
        console.log(result);
        notify('메뉴가 설정되었습니다.', 'success', 3000);
      },
      error: (e) => {
        console.error(e);
        notify('메뉴 설정에 실패하였습니다.', 'error', 3000);
      }
    });
  }

  onSelectionChanged(e) {
    this.selectedMenus = e.selectedRowsData;
    console.log(this.selectedMenus);
  }

  refresh() {
    this.menuList.reload();
  }
}

@NgModule({
  imports: [
    DxButtonModule,

    CommonModule,
    DxTreeListModule,
  ],
  providers: [],
  exports: [
    RoleMenuInnerComponent
  ],
  declarations: [RoleMenuInnerComponent],
})
export class RoleMenuInnerModule {
}
