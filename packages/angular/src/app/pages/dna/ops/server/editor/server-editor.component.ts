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
import {ContactStatusModule, FormTextboxModule, ToolbarFormModule} from "../../../../../components";
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
    console.log(this.server.id);
    this.apollo.query({
      query: gql`
        query applications($serverId: ID) {
          applications(serverId: $serverId) {
            id
            name
            restPort
            monitorPort
            status
            isDeployed
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
        serverId: this.server.id
      }
    }).subscribe((result: any) => {
      if (result.errors) {
        console.error(result.errors);
        return
      }
      this.applications = result.data.applications;
      console.log(this.applications);
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
          notify('애플리케이션 삭제가 완료되었습니다.', 'success', 3000);
          this.reloadTree();
        });
      }
    });
  }

  deploy() {
    this.apollo.mutate<any>({
      mutation: gql`
        mutation deployApplication($id: ID) {
          deployApplication(id: $id)
        }
      `,
      variables: {
        id: this.applicationId
      }
    }).subscribe((result: any) => {
      if (result.errors) {
        console.error(result.errors);
        return
      }
      notify('애플리케이션이 성공적으로 배포되었습니다.', 'success', 3000);
      this.refresh();
    });
  }

  startApplication() {
    this.apollo.mutate<any>({
      mutation: gql`
        mutation startApplication($id: ID) {
          startApplication(id: $id)
        }
      `,
      variables: {
        id: this.applicationId
      }
    }).subscribe((result: any) => {
      if (result.errors) {
        console.error(result.errors);
        return
      }
      notify('애플리케이션이 실행되었습니다.', 'success', 3000);
      this.refresh();
    });
  }

  stopApplication() {
    this.apollo.mutate<any>({
      mutation: gql`
        mutation stopApplication($id: ID) {
          stopApplication(id: $id)
        }
      `,
      variables: {
        id: this.applicationId
      }
    }).subscribe((result: any) => {
      if (result.errors) {
        console.error(result.errors);
        return
      }
      notify('애플리케이션이 정지되었습니다.', 'success', 3000);
      this.refresh();
    });
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

  isDeployed() {
    if (this.isSelected) {
      if (this.selectedApplication.isDeployed === true) {
        return true;
      }
      return false;
    }
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
    ContactStatusModule,
  ],
  providers: [],
  exports: [ServerEditorComponent],
  declarations: [ServerEditorComponent]
})
export class ServerEditorModule {

}
