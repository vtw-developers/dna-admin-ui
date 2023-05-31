import {
  Component, ViewChild, NgModule, ViewEncapsulation,
} from '@angular/core';
import {
  DxButtonModule,
  DxDataGridModule,
  DxDataGridComponent,
  DxDropDownButtonModule,
  DxSelectBoxModule,
  DxTextBoxModule, DxTreeViewModule, DxContextMenuModule, DxContextMenuComponent, DxPopupModule, DxPopupComponent,
} from 'devextreme-angular';
import {RowClickEvent} from 'devextreme/ui/data_grid';
import {exportDataGrid as exportDataGridToPdf} from 'devextreme/pdf_exporter';
import {exportDataGrid as exportDataGridToXLSX} from 'devextreme/excel_exporter';
import {
  CardActivitiesModule,
  ContactStatusModule, FormPopupComponent,
} from 'src/app/components';
import {Contact, contactStatusList, ContactStatus,} from 'src/app/types/contact';
import {SelectionChangedEvent} from 'devextreme/ui/drop_down_button';
import DataSource from 'devextreme/data/data_source';
import {CommonModule} from '@angular/common';
import {DataService} from 'src/app/services';
import {Workbook} from 'exceljs';
import {saveAs} from 'file-saver-es';
import {jsPDF} from 'jspdf';
import {formatPhone} from 'src/app/pipes/phone.pipe';
import {FormPopupModule} from 'src/app/components';
import {ContactPanelModule} from 'src/app/components/library/contact-panel/contact-panel.component';
import {ContactNewFormModule} from 'src/app/components/library/contact-new-form/contact-new-form.component';
import {Observable, of} from 'rxjs';
import {ExtractNewFormModule} from '../../../components/library/dna/extract-new-form/extract-new-form.component';
import {
  TemplateNewFormComponent,
  FlowTemplateNewFormModule
} from '../../../components/library/dna/template-new-form/template-new-form.component';
import {FlowTemplateListModule} from '../flow-template-list/flow-template-list.component';
import {
  GroupNewFormComponent,
  GroupNewFormModule
} from '../../../components/library/dna/group-new-form/group-new-form.component';
import {v4 as uuid} from 'uuid';
import {DxTreeViewComponent} from 'devextreme-angular/ui/tree-view';
import {ApplyPipeModule} from '../../../pipes/apply.pipe';
import {ExtractDetailsModule} from '../extract-details/extract-details.component';
import {TemplateDetailsModule} from '../template-details/template-details.component';

@Component({
  templateUrl: './flow-tree.component.html',
  styleUrls: ['./flow-tree.component.scss'],
  providers: [DataService],
  encapsulation: ViewEncapsulation.None,
})
export class FlowTreeComponent {
  treeItems: any[] = [
    {
      type: 'Group',
      id: 'Root',
      name: '그룹 목록',
      icon: 'folder',
      expanded: true,
    },
    {
      type: 'Group',
      id: '-1',
      parentId: 'Root',
      name: '추출',
      icon: 'folder',
      expanded: true,
    },
    {
      type: 'Group',
      id: '0',
      parentId: '-1',
      name: '초기 추출',
      icon: 'folder',
      expanded: true,
    },
    {
      type: 'Group',
      id: '1',
      parentId: '-1',
      name: '변경 추출',
      icon: 'folder',
      expanded: true,
    }, {
      type: 'Template',
      id: '1_1',
      parentId: '1',
      name: '변동 테이블 추출 템플릿',
      icon: 'template',
      expanded: true,
    }, {
      type: 'Flow',
      id: '1_1_1',
      parentId: '1_1',
      name: '대한상공회의소 추출',
      icon: 'flow',
      expanded: true,
    }, {
      type: 'Template',
      id: '1_2',
      parentId: '1',
      name: '원천 테이블 추출 템플릿',
      icon: 'template',
      expanded: true,
    }, {
      type: 'Group',
      id: '2',
      parentId: 'Root',
      name: 'Open API',
      icon: 'folder',
      expanded: true,
    }, {
      type: 'Template',
      id: '2_1',
      parentId: '2',
      name: '단순 조회 REST 템플릿',
      icon: 'template',
      expanded: true,
    }, {
      type: 'Template',
      id: '2_2',
      parentId: '2',
      name: '복합 조회 REST 템플릿',
      icon: 'flow',
      expanded: true,
    }
  ];
  currentItem: any;
  isNewTemplatePopupOpened = false;
  isNewGroupPopupOpened = false;

  menuItems = [
    {
      id: 'New',
      text: '생성',
      icon: 'plus',
      items: [
        {id: 'AddGroup', text: '그룹', icon: 'folder'},
        {id: 'AddTemplate', text: '템플릿', icon: 'template'},
      ]
    },
  ];

  @ViewChild(GroupNewFormComponent) newGroupForm: GroupNewFormComponent;
  @ViewChild(TemplateNewFormComponent) newTemplateForm: TemplateNewFormComponent;

  @ViewChild(DxTreeViewComponent, {static: false}) treeView: DxTreeViewComponent;
  @ViewChild(DxContextMenuComponent, {static: false}) contextMenu: DxContextMenuComponent;

  @ViewChild('newGroupPopup', {static: false}) newGroupPopup: FormPopupComponent;
  @ViewChild('newTemplatePopup', {static: false}) newTemplatePopup: FormPopupComponent;

  selectedTreeItem: any;

  constructor() {
  }

  selectItem(e) {
    console.log(e);
    this.currentItem = e.itemData;
  }

  addTemplate() {
    this.newTemplatePopup.visible = true;
  };

  addGroup() {
    this.newGroupPopup.visible = true;
  }

  onGroupSaved() {
    this.treeItems.push({
      type: 'Group',
      id: uuid(),
      parentId: this.selectedTreeItem?.id,
      icon: 'folder',
      expanded: true,
      ...this.newGroupForm.newGroup
    });
    this.newGroupPopup.close();
  }

  onTemplateSaved() {
    console.log(this.newTemplateForm.newTemplate);
    this.treeItems.push({
      type: 'Template',
      id: uuid(),
      parentId: this.selectedTreeItem?.id,
      expanded: true,
      icon: 'template',
      ...this.newTemplateForm.newTemplate
    })
    this.newTemplatePopup.close();
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

  contextMenuItemClick(e) {
    let logEntry = '';
    const treeView = this.treeView.instance;
    switch (e.itemData.id) {
      case 'AddGroup': {
        console.log(this.selectedTreeItem);
        this.addGroup();
        break;
      }
      case 'AddTemplate': {
        console.log(this.selectedTreeItem);
        this.addTemplate();
        break;
      }


      case 'expand': {
        logEntry = `The '${this.selectedTreeItem.text}' group was expanded`;
        treeView.expandItem(this.selectedTreeItem.id);
        break;
      }
      case 'collapse': {
        logEntry = `The '${this.selectedTreeItem.text}' group was collapsed`;
        treeView.collapseItem(this.selectedTreeItem.id);
        break;
      }
      case 'details': {
        logEntry = `Details about '${this.selectedTreeItem.text}' were displayed`;
        break;
      }
      case 'copy': {
        logEntry = `Information about '${this.selectedTreeItem.text}' was copied`;
        break;
      }
    }
  }

  protected readonly parent = parent;
}

@NgModule({
  imports: [
    DxButtonModule,
    DxDataGridModule,
    DxDropDownButtonModule,
    DxSelectBoxModule,
    DxTextBoxModule,

    ContactPanelModule,
    FlowTemplateNewFormModule,
    GroupNewFormModule,
    FormPopupModule,
    CardActivitiesModule,
    ContactStatusModule,

    CommonModule,
    DxTreeViewModule,
    FlowTemplateListModule,
    DxContextMenuModule,
    ApplyPipeModule,
    DxPopupModule,
    ExtractDetailsModule,
    TemplateDetailsModule,
  ],
  providers: [],
  exports: [],
  declarations: [FlowTreeComponent],
})
export class FlowTreeModule {
}
