import {Component, EventEmitter, NgModule, Output, ViewChild} from "@angular/core";
import {
  DxButtonModule,
  DxFormModule,
  DxPopupModule, DxRadioGroupModule,
  DxSelectBoxModule,
  DxTextBoxModule, DxValidationGroupComponent,
  DxValidationGroupModule,
  DxValidatorModule
} from "devextreme-angular";
import {FormTextboxModule} from "../../../utils/form-textbox/form-textbox.component";
import {Apollo, gql} from "apollo-angular";
import notify from "devextreme/ui/notify";

@Component({
  selector: 'deployed-flow-new-form',
  templateUrl: './deployed-flow-new-form.component.html',
  styleUrls: ['/deployed-flow-new-form.component.scss'],
  providers: [],
})
export class DeployedFlowNewFormComponent {

  @ViewChild(DxValidationGroupComponent, {static: false}) validationGroup: DxValidationGroupComponent;

  @Output() saved = new EventEmitter();

  popupVisible = false;
  deployedFlow = {} as any;
  createMode: boolean;
  applications;
  flows;

  constructor(private apollo: Apollo) {
  }

  openPopup(application: any) {
    console.log(application)
    this.createMode = true;
    this.deployedFlow = {
      application: application,
      deployed: false,
      autoStartUp: false
    }
    /*this.apollo.query({
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
        server: application.server
      }
    }).subscribe((result: any) => {
      if (result.errors) {
        console.error(result.errors);
        return
      }
      console.log(result.data.applications);
      this.applications = result.data.applications;
      this.deployedFlow.application = this.applications.find(application => application.id === this.deployedFlow.application.id);
    });*/
    this.apollo.query({
      query: gql`
        query monitoringFlows {
          monitoringFlows {
            id
            name
          }
        }
      `,
      variables: {}
    }).subscribe((result: any) => {
      if (result.errors) {
        console.error(result.errors);
      }
      console.log(result);
      this.flows = result.data.monitoringFlows;
      this.popupVisible = true;
      this.validationGroup?.instance.reset();
    });

  }

  save(e) {
    e.preventDefault();
    console.log(this.deployedFlow)
    this.apollo.mutate<any>({
      mutation: gql`
        mutation createDeployedFlow($deployedFlow: DeployedFlowInput) {
          createDeployedFlow(deployedFlow: $deployedFlow)
        }
      `,
      variables: {
        deployedFlow: this.deployedFlow
      }
    }).subscribe((result: any) => {
      if (result.errors) {
        console.error(result.errors);
        return
      }
      notify('서비스가 성공적으로 저장되었습니다.', 'success', 3000);
      this.popupVisible = false;
      this.saved.emit();
    });
  }

  cancel = () => {
    this.popupVisible = false;
  }
}

@NgModule({
  imports: [
    DxTextBoxModule,
    DxFormModule,
    DxValidatorModule,

    FormTextboxModule,

    DxSelectBoxModule,
    DxValidationGroupModule,
    DxPopupModule,
    DxButtonModule,
    DxRadioGroupModule,
  ],
  providers: [],
  exports: [DeployedFlowNewFormComponent],
  declarations: [DeployedFlowNewFormComponent]
})
export class DeployedFlowNewFormModule {
}
