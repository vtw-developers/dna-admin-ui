import {Component, Input, NgModule, ViewChild} from "@angular/core";
import {
  DxButtonModule,
  DxDataGridComponent,
  DxDataGridModule,
  DxFormModule,
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
import {ClickEvent} from "devextreme/ui/button";

@Component({
  selector: 'application-editor',
  templateUrl: './application-editor.component.html',
  styleUrls: ['./application-editor.component.scss'],
  providers: []
})
export class ApplicationEditorComponent {
  @ViewChild(DxDataGridComponent, {static: false}) grid: DxDataGridComponent;
  @ViewChild(ApplicationNewFormComponent, {static: false}) editApplicationPopup: ApplicationNewFormComponent;

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

  applicationId;
  selectedApplication;
  applications: DataSource;
  isSelected: boolean;
  server;

  /*applications = [
    {
      id: 1,
      name: 'Application1',
      restPort: '7901',
      monitoringPort: '7801'
    },
    {
      id: 2,
      name: 'Application2',
      restPort: '7902',
      monitoringPort: '7802'
    },
    {
      id: 3,
      name: 'Application3',
      restPort: '7903',
      monitoringPort: '7803'
    },
  ]*/


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
          this.refresh();
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
  ],
  providers: [],
  exports: [ApplicationEditorComponent],
  declarations: [ApplicationEditorComponent]
})
export class ApplicationEditorModule {

}
