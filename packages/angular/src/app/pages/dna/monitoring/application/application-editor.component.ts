import {Component, NgModule, ViewChild} from "@angular/core";
import {DxButtonModule, DxDataGridComponent, DxDataGridModule} from "devextreme-angular";
import {Apollo} from "apollo-angular";
import {RowClickEvent} from "devextreme/ui/data_grid";
import {
  ApplicationNewFormComponent,
  ApplicationNewFormModule
} from "../../../../components/library/dna/application-new-form/application-new-form.component";

@Component({
  templateUrl: './application-editor.component.html',
  styleUrls: ['./application-editor.component.scss'],
  providers: []
})
export class ApplicationEditorComponent {
  @ViewChild(DxDataGridComponent, {static: false}) grid: DxDataGridComponent;
  @ViewChild(ApplicationNewFormComponent, {static: false}) editApplicationPopup: ApplicationNewFormComponent;

  applicationId;
  selectedApplication;
  // applications: DataSource;
  isSelected: boolean;

  applications = [
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
  ]


  constructor(private apollo: Apollo) {

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
