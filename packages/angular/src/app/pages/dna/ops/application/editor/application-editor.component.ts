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
import {confirm} from "devextreme/ui/dialog";
import notify from "devextreme/ui/notify";

@Component({
  selector: 'application-editor',
  templateUrl: './application-editor.component.html',
  styleUrls: ['./application-editor.component.scss'],
  providers: []
})
export class ApplicationEditorComponent {

  @ViewChild(DxDataGridComponent, {static: false}) grid: DxDataGridComponent;
  @ViewChild(DeployedFlowNewFormComponent, {static: false}) editDeployedFlowPopup: DeployedFlowNewFormComponent;

  @Output() saved = new EventEmitter();

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

  reloadTree() {
    this.deployedFlowId = null;
    this.selectedDeployedFlow = undefined;
    this.isSelected = false;
    this.reloadDeployedFlows();
    this.saved.emit();
  }

  rowClick(e: RowClickEvent) {
    const {data} = e;
    this.selectedDeployedFlow = data;
    this.deployedFlowId = data.id;
    this.isSelected = true;
  }

  openAddDeployedFlow() {
    this.editDeployedFlowPopup.openPopup(this.application.id, this.application.server.id);
  }

  deploy() {

  }

  startDeployedFlow() {

  }

  stopDeployedFlow() {

  }

  delete() {
    const result = confirm('<i>정말로 서비스를 삭제하시겠습니까?</i>', '애플리케이션 삭제');
    result.then(dialogResult => {
      if (dialogResult) {
        this.apollo.mutate({
          mutation: gql`
            mutation deleteDeployedFlow($id: ID) {
              deleteDeployedFlow(id: $id)
            }
          `,
          variables: {
            id: this.deployedFlowId
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

  updateApplication() {

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
