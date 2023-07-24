import {Component, NgModule, ViewChild} from "@angular/core";
import {DxTreeViewComponent} from "devextreme-angular/ui/tree-view";
import {Apollo, gql} from "apollo-angular";
import {DxButtonModule, DxContextMenuModule, DxScrollViewModule, DxTreeViewModule} from "devextreme-angular";
import {ApplicationEditorComponent, ApplicationEditorModule} from "./application/editor/application-editor.component";
import {NgIf} from "@angular/common";
import {ApplicationPropertiesModule} from "./application/properties/application-properties.component";
import {ServerPropertiesModule} from "./server/properties/server-properties.component";
import {
  ServerNewFormComponent,
  ServerNewFormModule
} from "../../../components/library/dna/server-new-form/server-new-form.component";
import {confirm} from "devextreme/ui/dialog";
import notify from "devextreme/ui/notify";

@Component({
  templateUrl: './operation-tree.component.html',
  styleUrls: ['./operation-tree.component.scss'],
})
export class OperationTreeComponent {

  @ViewChild(DxTreeViewComponent, {static: false}) treeView: DxTreeViewComponent;
  @ViewChild(ApplicationEditorComponent, {static: false}) applicationEditor: ApplicationEditorComponent;
  @ViewChild(ServerNewFormComponent, {static: false}) editServerPopup: ServerNewFormComponent;

  treeItems: any[];
  currentItem;
  items: any[];
  treeItemDbClickTimeout: any = null;
  treeItemDbClickItem = {};
  contextItems: any;
  selectedTreeItem: any;

  constructor(private apollo: Apollo) {
    this.reloadTree();
  }

  reloadTree() {
    console.log(this.currentItem)
    this.apollo.query({
      query: gql`
        query servers {
          servers {
            id
            name
            os
            privateIp
            publicIp
          }
        }
      `,
      variables: {}
    }).subscribe((result: any) => {
      if (result.errors) {
        console.error(result.errors);
      }
      result.data.servers.forEach(e => {
        e.type = 'server'
        e.expanded = true
        e.icon = '/assets/icons/common/server.svg';
      })
      this.treeItems = result.data.servers;

      this.apollo.query({
        query: gql`
          query findAllApplications {
            findAllApplications {
              id
              name
              restPort
              monitorPort
              server {
                id
                name
              }
            }
          }
        `,
        variables: {}
      }).subscribe((result: any) => {
        if (result.errors) {
          console.error(result.errors);
        }
        result.data.findAllApplications.forEach(e => {
          e.type = 'application'
          e.parentId = e.server.id;
          e.icon = '/assets/icons/common/application.svg';
          this.treeItems.push(e);
        });
      });
    });
  }

  selectItem(e) {
    /*  if (!this.treeItemDbClickTimeout) {
        this.treeItemDbClickItem = e.itemData;
        this.treeItemDbClickTimeout = setTimeout(() => {
          this.treeItemDbClickTimeout = null;
        }, 500);
      } else if (e.itemData === this.treeItemDbClickItem) {
        this.currentItem = e.itemData;
        console.log(this.currentItem);
      }*/
    this.currentItem = e.itemData;
  }

  refresh() {
    this.reloadTree();
  }

  treeViewItemContextMenu(e: any) {
    console.log(e.itemData)
    this.selectedTreeItem = e.itemData;
    if (this.selectedTreeItem.type === 'server') {
      this.contextItems = [
        {
          id: 'deleteServer',
          text: '서버 삭제',
          type: 'deleteServer',
          icon: 'trash'
        },
      ]
    }
  }

  openEditor() {

  }

  openAddServer() {
    this.currentItem = undefined;
    this.editServerPopup.openPopup(this.currentItem);
  }

  onTreeMenuClick(e: any) {
    switch (e.itemData.type) {
      case 'deleteServer': {
        const result = confirm('<i>정말로 서버를 삭제하시겠습니까?</i>', '서버 삭제');
        result.then(dialogResult => {
          if (dialogResult) {
            this.apollo.mutate({
              mutation: gql`
                mutation deleteServer($id: ID) {
                  deleteServer(id: $id)
                }
              `,
              variables: {
                id: this.selectedTreeItem.id
              }
            }).subscribe((result: any) => {
              if (result.errors) {
                console.error(result.errors);
              }
              notify('서버 삭제가 완료되었습니다.', 'success', 3000);
              this.refresh();
            });
          }
        });
      }
    }
  }
}

@NgModule({
  imports: [
    DxTreeViewModule,
    DxScrollViewModule,
    ApplicationEditorModule,
    NgIf,
    ApplicationPropertiesModule,
    ServerPropertiesModule,
    DxButtonModule,
    ServerNewFormModule,
    DxContextMenuModule,
  ],
  providers: [],
  exports: [],
  declarations: [OperationTreeComponent]
})
export class ApplicationTreeModule {
}
