import {Component, Input, NgModule, ViewChild} from "@angular/core";
import {DxButtonModule, DxDataGridComponent, DxDataGridModule} from "devextreme-angular";
import {Apollo, gql} from "apollo-angular";
import {RowClickEvent} from "devextreme/ui/data_grid";
import {
  ApplicationNewFormComponent,
  ApplicationNewFormModule
} from "../../../../components/library/dna/application-new-form/application-new-form.component";
import DataSource from "devextreme/data/data_source";

@Component({
  selector: 'application-editor',
  templateUrl: './application-editor.component.html',
  providers: []
})
export class ApplicationEditorComponent {
  @ViewChild(DxDataGridComponent, {static: false}) grid: DxDataGridComponent;
  @ViewChild(ApplicationNewFormComponent, {static: false}) editApplicationPopup: ApplicationNewFormComponent;

  @Input() set selectedServer(currentItem) {
    console.log(currentItem);
    this.server = {
      id: currentItem.id,
      name: currentItem.name,
      os: currentItem.os,
      privateIp: currentItem.privateIp,
      publicIp: currentItem.publicIp
    }
    console.log(this.server)
    this.reloadApplications();
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
    console.log(this.server)
    this.apollo.query({
      query: gql`
        query applications($server: ServerInput) {
          applications(server: $server) {
            id
            name
            restPort
            monitorPort
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
    console.log('Refresh');
    this.applicationId = null;
    this.selectedApplication = undefined;
    this.isSelected = false;
  };

  rowClick(e: RowClickEvent) {
    const {data} = e;
    this.selectedApplication = data;
    this.applicationId = data.id;
    this.isSelected = true;
  }

  openAddApplication() {
    this.editApplicationPopup.openPopup(this.selectedApplication);
  }

  delete() {

  }
}
@NgModule({
  imports: [
    DxDataGridModule,
    DxButtonModule,
    ApplicationNewFormModule,
  ],
  providers: [],
  exports: [ApplicationEditorComponent],
  declarations: [ApplicationEditorComponent]
})
export class ApplicationEditorModule {

}
