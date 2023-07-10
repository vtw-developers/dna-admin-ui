import {Component, NgModule, ViewChild} from '@angular/core';
import 'devextreme/data/odata/store';
import {Apollo, gql} from "apollo-angular";
import DataSource from "devextreme/data/data_source";
import {
  DxButtonModule, DxContextMenuComponent, DxContextMenuModule,
  DxDataGridComponent,
  DxDataGridModule, DxScrollViewModule, DxTabPanelModule, DxTreeViewModule
} from "devextreme-angular";
import notify from "devextreme/ui/notify";
import {CommonModule} from "@angular/common";
import {confirm} from "devextreme/ui/dialog";
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

  treeItems: any[] = [
    {
      type: 'Template',
      id: '1',
      name: '권한그룹1',
      icon: 'template',
      expanded: true,
    }, {
      type: 'Template',
      id: '2',
      name: '권한그룹2',
      icon: 'template',
      expanded: true,
    },
  ];

  isNewRolePopupOpened = false;
  isNewDeptPopupOpened = false;

  @ViewChild(GroupNewFormComponent) newGroupForm: GroupNewFormComponent;
  @ViewChild(TemplateNewFormComponent) newTemplateForm: TemplateNewFormComponent;

  @ViewChild(DxTreeViewComponent, {static: false}) treeView: DxTreeViewComponent;
  @ViewChild(DxContextMenuComponent, {static: false}) contextMenu: DxContextMenuComponent;

  @ViewChild(RoleTab, {static: false}) userRole: RoleTab;
  @ViewChild('newDeptPopup', {static: false}) newDeptPopup: FormPopupComponent;
  @ViewChild('newRolePopup', {static: false}) newRolePopup: FormPopupComponent;

  currentItem: any;
  currentParent: any;
  selectedTreeItem: any;
  role = "";
  company = "";

  constructor(private apollo: Apollo) {

  }

  selectItem(e) {
    console.log(e);
    this.currentItem = e.itemData;
    this.currentParent = e.node.parent.itemData;
    this.role = this.currentItem.name;
    this.company = this.currentParent.name;

    // this.userRole.search(this.company, this.role);
  }

  onDeptSaved() {
    this.treeItems.push({
      type: 'Group',
      id: uuid(),
      parentId: this.selectedTreeItem?.id,
      icon: 'folder',
      expanded: true,
      ...this.newGroupForm.newGroup
    });
    this.newDeptPopup.close();
  }

  onRoleSaved() {
    console.log(this.newTemplateForm.newTemplate);
    this.treeItems.push({
      type: 'Template',
      id: uuid(),
      parentId: this.selectedTreeItem?.id,
      expanded: true,
      icon: 'template',
      ...this.newTemplateForm.newTemplate
    })
    this.newRolePopup.close();
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
