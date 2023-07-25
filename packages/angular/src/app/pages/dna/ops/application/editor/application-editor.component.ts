import {Component, Input, NgModule, ViewChild} from "@angular/core";
import {
  DxButtonModule, DxDataGridComponent,
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
import {Apollo} from "apollo-angular";
import {RowClickEvent} from "devextreme/ui/data_grid";

@Component({
  selector: 'application-editor',
  templateUrl: './application-editor.component.html',
  styleUrls: ['./application-editor.component.scss'],
  providers: []
})
export class ApplicationEditorComponent {

  @ViewChild(DxDataGridComponent, {static: false}) grid: DxDataGridComponent;

  @Input() set selectedItem(currentItem) {
    console.log(currentItem);
  }

  deployedFlowId;
  selectedDeployedFlow;
  deployedFlows: DataSource;
  isSelected: boolean;

  constructor(private apollo: Apollo) {
  }

  reloadDeployedFlows() {

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

  }

  deploy() {

  }

  startDeployedFlow() {

  }

  stopDeployedFlow() {

  }

  delete() {

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
  exports: [ApplicationEditorComponent],
  declarations: [ApplicationEditorComponent]
})
export class ApplicationEditorModule {

}
