import {Component, Input, NgModule} from "@angular/core";
import {Apollo, gql} from "apollo-angular";
import {DxScrollViewModule, DxSelectBoxModule} from "devextreme-angular";
import {SafePipeModule} from "../../../../../pipes/SafePipe";

@Component({
  selector: './deployed-flow-monitoring',
  templateUrl: './deployed-flow-monitoring.component.html',
  providers: []
})
export class DeployedFlowMonitoringComponent {

  monitoringUrl = 'http://192.168.162.128:3000/d/YWfN6wL7z/2-service-details?orgId=1&kiosk';
  flows;
  navItem;
  @Input() set selectedItem(currentItem) {
    console.log(currentItem)
    this.navItem = currentItem;
  }

  constructor(private apollo: Apollo) {

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
    });

  }

  changeMonitoringUrl(e) {
    console.log(e);
    this.monitoringUrl = 'http://192.168.162.128:3000/d/YWfN6wL7z/2-service-details?orgId=1&kiosk&var-service='+e.value.name;
    console.log(this.monitoringUrl);
  }
}

@NgModule({
  imports: [
    DxSelectBoxModule,
    SafePipeModule,
    DxScrollViewModule,
  ],
  providers: [],
  exports: [DeployedFlowMonitoringComponent],
  declarations: [DeployedFlowMonitoringComponent],
})
export class DeployedFlowMonitoringModule { }
