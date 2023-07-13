import {Component, NgModule} from "@angular/core";
import {Apollo, gql} from "apollo-angular";
import {DxSelectBoxModule} from "devextreme-angular";
import {SafePipeModule} from "../../../../pipes/SafePipe";

@Component({
  templateUrl: './flow-monitoring.component.html',
  providers: []
})
export class FlowMonitoringComponent {
  flows;
  monitoringUrl = 'http://192.168.162.128:3000/d/YWfN6wL7z/2-service-details?orgId=1&kiosk';

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
  ],
  providers: [],
  exports: [FlowMonitoringComponent],
  declarations: [FlowMonitoringComponent],
})
export class FlowMonitoringModule { }
