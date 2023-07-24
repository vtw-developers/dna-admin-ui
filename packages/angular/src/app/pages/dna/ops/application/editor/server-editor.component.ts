import {Component, EventEmitter, Input, NgModule, Output, ViewChild} from "@angular/core";
import {
  DxButtonModule,
  DxDataGridComponent,
  DxDataGridModule,
  DxFormModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxValidationGroupModule
} from "devextreme-angular";
import {Apollo, gql} from "apollo-angular";
import {RowClickEvent} from "devextreme/ui/data_grid";
import {
  ApplicationNewFormComponent,
  ApplicationNewFormModule
} from "../../../../../components/library/dna/application-new-form/application-new-form.component";
import DataSource from "devextreme/data/data_source";
import {confirm} from "devextreme/ui/dialog";
import notify from "devextreme/ui/notify";
import {FormTextboxModule, ToolbarFormModule} from "../../../../../components";
import {NgIf} from "@angular/common";

@Component({
  selector: 'server-editor',
  templateUrl: './server-editor.component.html',
  styleUrls: ['./server-editor.component.scss'],
  providers: []
})
export class ServerEditorComponent {
  @ViewChild(DxDataGridComponent, {static: false}) grid: DxDataGridComponent;
  @ViewChild(ApplicationNewFormComponent, {static: false}) editApplicationPopup: ApplicationNewFormComponent;

  @Output() saved = new EventEmitter();

  @Input() set selectedItem(currentItem) {
    console.log(currentItem);
    this.server = {
      id: currentItem.id,
      name: currentItem.name,
      os: currentItem.os,
      privateIp: currentItem.privateIp,
      publicIp: currentItem.publicIp
    }
    this.refresh();
  }

  serverStatus = 'On';
  applicationId;
  selectedApplication;
  applications: DataSource;
  isSelected: boolean;
  server;
  os = [{code: 1, text: 'CentOS', value: 'CentOS'},
    {code: 2, text: 'Rocky', value: 'Rocky'},
    {code: 3, text: 'Ubuntu Server', value: 'Ubuntu Server'}];

  constructor(private apollo: Apollo) {
  }

  reloadApplications() {
    this.apollo.query({
      query: gql`
        query applications($server: ServerInput) {
          applications(server: $server) {
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
      variables: {
        server: this.server
      }
    }).subscribe((result: any) => {
      if (result.errors) {
        console.error(result.errors);
        return
      }
      console.log(result.data.applications);
      this.applications = result.data.applications;
    });
  }

  refresh = () => {
    this.applicationId = null;
    this.selectedApplication = undefined;
    this.isSelected = false;
    this.reloadApplications();
  };

  reloadTree() {
    this.applicationId = null;
    this.selectedApplication = undefined;
    this.isSelected = false;
    this.reloadApplications();
    this.saved.emit();
  }

  rowClick(e: RowClickEvent) {
    const {data} = e;
    this.selectedApplication = data;
    this.applicationId = data.id;
    this.isSelected = true;
  }

  openAddApplication() {
    this.editApplicationPopup.openPopup(this.selectedApplication, this.server.id);
  }

  delete() {
    const result = confirm('<i>정말로 애플리케이션을 삭제하시겠습니까?</i>', '애플리케이션 삭제');
    result.then(dialogResult => {
      if (dialogResult) {
        this.apollo.mutate({
          mutation: gql`
            mutation deleteApplication($id: ID) {
              deleteApplication(id: $id)
            }
          `,
          variables: {
            id: this.applicationId
          }
        }).subscribe((result: any) => {
          if (result.errors) {
            console.error(result.errors);
          }
          console.log(result);
          notify('애플리케이션 삭제가 완료되었습니다.', 'success', 3000);
          this.reloadTree();
        });
      }
    });
  }

  deploy() {

  }

  startApplication() {

  }

  stopApplication() {

  }

  updateServer() {
    this.apollo.mutate<any>({
      mutation: gql`
        mutation updateServer($server: ServerInput) {
          updateServer(server: $server)
        }
      `,
      variables: {
        server: this.server
      }
    }).subscribe((result: any) => {
      if (result.errors) {
        console.error(result.errors);
        return
      }
      notify('서버가 성공적으로 수정되었습니다.', 'success', 3000);
      this.saved.emit();
    });
  }


}

@NgModule({
  imports: [
    DxFormModule,
    DxDataGridModule,
    DxButtonModule,
    ApplicationNewFormModule,
    FormTextboxModule,
    ToolbarFormModule,
    DxValidationGroupModule,
    DxTextBoxModule,
    DxSelectBoxModule,
    NgIf,
  ],
  providers: [],
  exports: [ServerEditorComponent],
  declarations: [ServerEditorComponent]
})
export class ServerEditorModule {

}
