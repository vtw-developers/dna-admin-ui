import {Component, EventEmitter, Output, NgModule, ViewChild} from '@angular/core';
import notify from "devextreme/ui/notify";
import 'devextreme/data/odata/store';
import {Apollo, gql} from "apollo-angular";
import {Service, Menu} from "../menu.service";
import {
  DxButtonModule, DxCheckBoxModule, DxDataGridComponent, DxDataGridModule, DxDateBoxModule,
  DxFormComponent,
  DxPopupComponent,
  DxPopupModule, DxSelectBoxModule,
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

@Component({
  selector: 'menu-edit-popup',
  templateUrl: './menu-edit.component.html',
  providers: [Service],
})

export class MenuEditComponent {
  menu: Menu = {} as any;
  parentId: DataSource;
  selectedParent;
  types: string[];
  type;
  editMode: 'create' | 'update';
  popupVisible = false;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onSaved = new EventEmitter<Menu>();

  @ViewChild(DxFormComponent, {static: false}) form: DxFormComponent;
  @ViewChild(DxValidationGroupComponent, {static: false}) validationGroup: DxValidationGroupComponent;
  @ViewChild(DxPopupComponent, {static: false}) popup: DxPopupComponent;
  @ViewChild(DxDataGridComponent, {static: false}) grid: DxDataGridComponent;

  constructor(private apollo: Apollo, service: Service) {
    this.types = service.getTypes();
    this.apollo.query({
      query: gql`
        query menuType($type: String) {
          menuType(type: $type) {
            id
            name
          }
        }
      `,
      variables: {
        type: "Group"
      }
    }).subscribe({
      next: (result: any) => {
        this.parentId = result.data.menuType;
      },
      error: (e) => {
        console.error(e);
        notify('권한 정보를 불러오는데 실패하였습니다.', 'error', 3000);
      }
    });
  }

  open(editMode: 'create' | 'update', id?: any) {
    this.validationGroup?.instance.reset();
    this.editMode = editMode;
    if(this.isUpdateMode()){
      this.apollo.query({
        query: gql`
          query menu($id: ID) {
            menu(id: $id) {
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
          id: id
        }
      }).subscribe({
        next: (result: any) => {
          this.menu = result.data.menu;
          this.popupVisible = true;
        },
        error: (e) => {
          console.error(e);
          notify('권한 정보를 불러오는데 실패하였습니다.', 'error', 3000);
        }
      });
    } else {
      this.popupVisible = true;
      this.selectedParent = null;
      this.menu = {id: null, name: null, detail: null, parentName:null, parentId: null, path: null, type: null, icon: null, expanded: null};
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

  isGroup(){
    if(this.menu.type === 'Group'){
      this.menu.parentId = null;
      this.menu.path = null;
    }
    return this.menu.type === 'Group';
  }

  isTemplate(){
    if(this.menu.type === 'Template'){
      this.menu.icon = null;
    }
    return this.menu.type === 'Template';
  }

  /** Popup Button Events */
  save = (e) => {
    e.preventDefault();
    this.close();
    if (this.isCreateMode()) {
      this.menu.expanded = true;
      this.menu.parentId = this.selectedParent.id;
      this.menu.parentName = this.selectedParent.name;
      this.apollo.mutate({
        mutation: gql`
          mutation createMenu($menu: MenuInput) {
            createMenu(menu: $menu) {
              id
            }
          }
        `,
        variables: {
          menu: this.menu
        }
      }).subscribe({
        next: (result: any) => {
          notify('메뉴가 생성되었습니다.', 'success', 3000);
          this.onSaved.emit(result.data.createMenu);
        },
        error: (e) => {
          console.error(e);
          notify('메뉴 생성에 실패하였습니다.', 'error', 3000);
        }
      });
    } else {
      this.apollo.mutate({
        mutation: gql`
          mutation updateMenu($menu: MenuInput) {
            updateMenu(menu: $menu) {
              id
            }
          }
        `,
        variables: {
          menu: this.menu
        }
      }).subscribe({
        next: (result: any) => {
          notify('메뉴가 변경되었습니다.', 'success', 3000);
          this.onSaved.emit(result.data.updateMenu);
        },
        error: (e) => {
          console.error(e);
          notify('메뉴 변경에 실패하였습니다.', 'error', 3000);
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
    DxSelectBoxModule,
  ],
  providers: [],
  exports: [
    MenuEditComponent
  ],
  declarations: [MenuEditComponent],
})
export class MenuEditModule {
}
