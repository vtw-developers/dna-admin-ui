import {Component, NgModule, ViewChild} from '@angular/core';
import 'devextreme/data/odata/store';
import {Apollo, gql} from "apollo-angular";
import {
  DxButtonModule, DxContextMenuComponent, DxContextMenuModule,
  DxDataGridComponent,
  DxDataGridModule, DxScrollViewModule, DxTabPanelModule, DxTreeViewModule
} from "devextreme-angular";
import notify from "devextreme/ui/notify";
import {CommonModule} from "@angular/common";
import {
  FlowTemplateNewFormModule,
  TemplateNewFormComponent
} from "../../components/library/dna/template-new-form/template-new-form.component";
import {FormPopupComponent, FormPopupModule} from "../../components";
import {
  GroupNewFormComponent,
  GroupNewFormModule
} from "../../components/library/dna/group-new-form/group-new-form.component";
import {TemplateDetailsModule} from "../dna/template-details/template-details.component";
import {DxTreeViewComponent} from "devextreme-angular/ui/tree-view";
import {v4 as uuid} from 'uuid';
import {RoleTab, UsersTwoModule} from "./roleTab.component";

@Component({
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
})
export class RoleComponent {

  @ViewChild(GroupNewFormComponent) newGroupForm: GroupNewFormComponent;
  @ViewChild(TemplateNewFormComponent) newTemplateForm: TemplateNewFormComponent;

  @ViewChild(DxTreeViewComponent, {static: false}) treeView: DxTreeViewComponent;
  @ViewChild(DxContextMenuComponent, {static: false}) contextMenu: DxContextMenuComponent;

  @ViewChild(RoleTab, {static: false}) userRole: RoleTab;
  @ViewChild('newDeptPopup', {static: false}) newDeptPopup: FormPopupComponent;
  @ViewChild('newRolePopup', {static: false}) newRolePopup: FormPopupComponent;

  treeItems: any[];
  currentItem: any;
  currentParent: any;
  selectedTreeItem: any;
  role = "";
  company = "";

  constructor(private apollo: Apollo) {
    this.apollo.query({
      query: gql`
        query rolesList($name: String) {
          rolesList(name: $name) {
            id
            name
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
        console.log(result.data.rolesList);
        this.treeItems = result.data.rolesList;
        console.log(this.treeItems);
      },
      error: (e) => {
        console.error(e);
        notify('오류가 발생하였습니다.', 'error', 3000);
      }
    });
  }

  selectItem(e) {
    console.log(e);
    this.currentItem = e.itemData;
    this.currentParent = e.node.parent.itemData;
    this.role = this.currentItem.name;
    this.company = this.currentParent.name;

    // this.userRole.search(this.company, this.role);
  }

  treeViewItemContextMenu(e) {
    console.log(e);
    this.selectedTreeItem = e.itemData;
    //
    // const isProduct = e.itemData.price !== undefined;
    // const contextMenu = this.contextMenu.instance;
    // contextMenu.option('items[0].visible', !isProduct);
    // contextMenu.option('items[1].visible', !isProduct);
    // contextMenu.option('items[2].visible', isProduct);
    // contextMenu.option('items[3].visible', isProduct);
    //
    // contextMenu.option('items[0].disabled', e.node.expanded);
    // contextMenu.option('items[1].disabled', !e.node.expanded);
  }

  protected readonly parent = parent;
}

@NgModule({
  imports: [
    DxButtonModule,
    DxDataGridModule,

    CommonModule,
    DxTreeViewModule,
    DxTabPanelModule,
    DxContextMenuModule,
    DxScrollViewModule,
    FlowTemplateNewFormModule,
    FormPopupModule,
    GroupNewFormModule,
    TemplateDetailsModule,
    UsersTwoModule,
  ],
  providers: [],
  exports: [],
  declarations: [RoleComponent],
})
export class RoleModule {
}
