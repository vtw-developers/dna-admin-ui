import {Component, NgModule, ViewChild} from "@angular/core";
import {DxTreeViewComponent} from "devextreme-angular/ui/tree-view";
import {Apollo, gql} from "apollo-angular";
import {DxScrollViewModule, DxTreeViewModule} from "devextreme-angular";
import {ApplicationEditorComponent, ApplicationEditorModule} from "./application/editor/application-editor.component";
import {NgIf} from "@angular/common";
import {ApplicationPropertiesModule} from "./application/properties/application-properties.component";
import {ServerPropertiesModule} from "./server/properties/server-properties.component";

@Component({
  templateUrl: './operation-tree.component.html',
  styleUrls: ['./operation-tree.component.scss'],
})
export class OperationTreeComponent {

  @ViewChild(DxTreeViewComponent, {static: false}) treeView: DxTreeViewComponent;
  @ViewChild(ApplicationEditorComponent, {static: false}) applicationEditor: ApplicationEditorComponent;

  treeItems: any[];
  currentItem;
  items: any[];
  treeItemDbClickTimeout: any = null;
  treeItemDbClickItem = {};

  constructor(private apollo: Apollo) {
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
      console.log(result.data.servers);
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
        console.log(result);
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
    console.log(e);
      if (!this.treeItemDbClickTimeout) {
        this.treeItemDbClickItem = e.itemData;
        this.treeItemDbClickTimeout = setTimeout(() => {
          this.treeItemDbClickTimeout = null;
        }, 500);
      } else if (e.itemData === this.treeItemDbClickItem) {
        this.currentItem = e.itemData;
        console.log(this.currentItem);
      }
  }

  treeViewItemContextMenu($event: any) {

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
  ],
  providers: [],
  exports: [],
  declarations: [OperationTreeComponent]
})
export class ApplicationTreeModule {
}
