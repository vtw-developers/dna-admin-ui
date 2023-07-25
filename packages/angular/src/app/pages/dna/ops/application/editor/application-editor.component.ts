import {Component, Input, NgModule, ViewChild} from "@angular/core";
import {
  DxButtonModule,
  DxDataGridComponent,
  DxDataGridModule,
  DxFormModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxValidationGroupModule
} from "devextreme-angular";
import {
  ApplicationNewFormModule
} from "../../../../../components/library/dna/application-new-form/application-new-form.component";
import {FormTextboxModule, ToolbarFormModule} from "../../../../../components";
import {NgIf} from "@angular/common";
import DataSource from "devextreme/data/data_source";
import {Apollo, gql} from "apollo-angular";
import {RowClickEvent} from "devextreme/ui/data_grid";
import {
  DeployedFlowNewFormComponent, DeployedFlowNewFormModule
} from "../../../../../components/library/dna/deployed-flow-new-form/deployed-flow-new-form.component";

@Component({
  selector: 'application-editor',
  templateUrl: './application-editor.component.html',
  styleUrls: ['./application-editor.component.scss'],
  providers: []
})
export class ApplicationEditorComponent {

  @ViewChild(DxDataGridComponent, {static: false}) grid: DxDataGridComponent;
  @ViewChild(DeployedFlowNewFormComponent, {static: false}) editDeployedFlowPopup: DeployedFlowNewFormComponent;

  @Input() set selectedItem(currentItem) {
    console.log(currentItem);
    this.application = {
      id: currentItem.id,
      name: currentItem.name,
      restPort: currentItem.restPort,
      monitorPort: currentItem.monitorPort,
      server: currentItem.server
    }
    this.refresh();
  }

  application;
  deployedFlowId;
  selectedDeployedFlow;
  deployedFlows: DataSource;
  isSelected: boolean;

  constructor(private apollo: Apollo) {
  }

  reloadDeployedFlows() {
    this.apollo.query({
      query: gql`
        query deployedFlows($applicationId: ID!) {
          deployedFlows(applicationId: $applicationId) {
            id
            application {
              id
              name
              restPort
              monitorPort
            }
            flow {
              id
              name
            }
            autoStartUp
            deployed
          }
        }
      `,
      variables: {
        applicationId: this.application.id
      }
    }).subscribe((result: any) => {
      if (result.errors) {
        console.error(result.errors);
        return
      }
      this.deployedFlows = result.data.deployedFlows;
    });
  }

  refresh = () => {
    this.deployedFlowId = null;
    this.selectedDeployedFlow = undefined;
    this.isSelected = false;
    this.reloadDeployedFlows();
  }

  rowClick(e: RowClickEvent) {
    const {data} = e;
    this.selectedDeployedFlow = data;
    this.selectedDeployedFlow = data.id;
    this.isSelected = true;
  }

  openAddDeployedFlow() {
    this.editDeployedFlowPopup.openPopup(this.application);
  }

  deploy() {

  }

  startDeployedFlow() {

  }

  stopDeployedFlow() {

  }

  delete() {

  }

  updateApplication() {

  }

  reloadTree() {

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
    DeployedFlowNewFormModule,
  ],
  providers: [],
  exports: [ApplicationEditorComponent],
  declarations: [ApplicationEditorComponent]
})
export class ApplicationEditorModule {

}
