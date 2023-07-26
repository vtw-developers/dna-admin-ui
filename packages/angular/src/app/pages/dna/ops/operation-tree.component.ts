import {Component, NgModule, ViewChild} from "@angular/core";
import {DxTreeViewComponent} from "devextreme-angular/ui/tree-view";
import {Apollo, gql} from "apollo-angular";
import {DxButtonModule, DxContextMenuModule, DxScrollViewModule, DxTreeViewModule} from "devextreme-angular";
import {ServerEditorComponent, ServerEditorModule} from "./server/editor/server-editor.component";
import {NgIf} from "@angular/common";
import {ApplicationPropertiesModule} from "./application/properties/application-properties.component";
import {ServerPropertiesModule} from "./server/properties/server-properties.component";
import {
  ServerNewFormComponent,
  ServerNewFormModule
} from "../../../components/library/dna/server-new-form/server-new-form.component";
import {confirm} from "devextreme/ui/dialog";
import notify from "devextreme/ui/notify";
import {DeployedFlowPropertiesModule} from "./deployed-flow/properties/deployed-flow-properties.component";

@Component({
  templateUrl: './operation-tree.component.html',
  styleUrls: ['./operation-tree.component.scss'],
})
export class OperationTreeComponent {

  @ViewChild(DxTreeViewComponent, {static: false}) treeView: DxTreeViewComponent;
  @ViewChild(ServerEditorComponent, {static: false}) applicationEditor: ServerEditorComponent;
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
                os
                privateIp
                publicIp
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

        this.apollo.query({
          query: gql`
            query findAllDeployedFlows {
              findAllDeployedFlows {
                id
                flow {
                  id
                  name
                }
                application {
                  id
                  name
                }
                autoStartUp
                deployed

              }
            }
          `,
          variables: {}
        }).subscribe((result: any) => {
          if (result.errors) {
            console.error(result.errors);
          }
          console.log(result.data.findAllDeployedFlows);
          result.data.findAllDeployedFlows.forEach(e => {
            e.name = e.flow.name;
            e.type = 'deployedFlow'
            e.parentId = e.application.id;
            e.icon = '/assets/icons/common/service.svg';
            this.treeItems.push(e);
          });


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
    } else if (this.selectedTreeItem.type === 'application') {
      this.contextItems = [
        {
          id: 'deleteApplication',
          text: '애플리케이션 삭제',
          type: 'deleteApplication',
          icon: 'trash'
        },
      ]
    }
  }

  openAddServer() {
    this.currentItem = undefined;
    this.editServerPopup.openPopup(this.currentItem);
  }

  onTreeMenuClick(e: any) {
    console.log(e.itemData)
    switch (e.itemData.type) {
      case 'deleteServer': {
        const result = confirm(`<i>서버 '${this.selectedTreeItem.name}' 를 삭제하시겠습니까?</i>`, '서버 삭제');
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
              this.reloadTree();
            });
          }
        });
        return;
      }
      case 'deleteApplication': {
        const result = confirm(`<i>애플리케이션 '${this.selectedTreeItem.name}' 을 삭제하시겠습니까?</i>`, '애플리케이션 삭제');
        result.then(dialogResult => {
          if (dialogResult) {
            this.apollo.mutate({
              mutation: gql`
                mutation deleteApplication($id: ID) {
                  deleteApplication(id: $id)
                }
              `,
              variables: {
                id: this.selectedTreeItem.id
              }
            }).subscribe((result: any) => {
              if (result.errors) {
                console.error(result.errors);
              }
              notify('애플리케이션 삭제가 완료되었습니다.', 'success', 3000);
              this.currentItem = this.selectedTreeItem.server;
              this.currentItem = undefined;
              this.reloadTree();
            });
          }
        });
        return;
      }

    }
  }
}

@NgModule({
  imports: [
    DxTreeViewModule,
    DxScrollViewModule,
    ServerEditorModule,
    NgIf,
    ApplicationPropertiesModule,
    ServerPropertiesModule,
    DxButtonModule,
    ServerNewFormModule,
    DxContextMenuModule,
    DeployedFlowPropertiesModule,
  ],
  providers: [],
  exports: [],
  declarations: [OperationTreeComponent]
})
export class ApplicationTreeModule {
}
