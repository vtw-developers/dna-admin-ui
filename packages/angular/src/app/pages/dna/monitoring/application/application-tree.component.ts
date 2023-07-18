import {Component, NgModule, ViewChild} from "@angular/core";
import {DxTreeViewComponent} from "devextreme-angular/ui/tree-view";
import {Apollo, gql} from "apollo-angular";
import {DxScrollViewModule, DxTreeViewModule} from "devextreme-angular";
import {ApplicationEditorComponent, ApplicationEditorModule} from "./application-editor.component";
import {NgIf} from "@angular/common";

@Component({
  templateUrl: './application-tree.component.html',
  styleUrls: ['./application-tree.component.scss'],
})
export class ApplicationTreeComponent {

  @ViewChild(DxTreeViewComponent, {static: false}) treeView: DxTreeViewComponent;
  @ViewChild(ApplicationEditorComponent, {static: false}) applicationEditor: ApplicationEditorComponent;

  treeItems: any[];
  currentItem;

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
        e.icon = '/assets/icons/common/server.svg';
      })

      this.treeItems = result.data.servers;
    });
  }

  selectItem(e) {
    console.log(e)
    this.currentItem = e.itemData;
    console.log(this.currentItem);
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
  ],
  providers: [],
  exports: [],
  declarations: [ApplicationTreeComponent]
})
export class ApplicationTreeModule {
}
