import {Component, Input, NgModule, ViewChild} from "@angular/core";
import {SafePipeModule} from "../../../../../pipes/SafePipe";
import {Apollo, gql} from "apollo-angular";
import {DxScrollViewModule, DxSelectBoxModule} from "devextreme-angular";

@Component({
  selector: 'server-monitoring',
  templateUrl: './server-monitoring.component.html',
  providers: []
})
export class ServerMonitoringComponent {

  monitoringUrl = 'http://192.168.162.128:3000/d/rYdddlPWk/node-exporter-full?orgId=1&refresh=1m&kiosk';
  servers;
  navItem;
  @Input() set selectedItem(currentItem) {
    console.log(currentItem)
    this.navItem = currentItem;
  }

  constructor(private apollo: Apollo) {

    this.apollo.query({
      query: gql`
        query servers {
          servers {
            id
            name
            os
            privateIp
            publicIp
          }
        }
      `,
      variables: {}
    }).subscribe((result: any) => {
      if (result.errors) {
        console.error(result.errors);
      }
      console.log(result);
      this.servers = result.data.servers;
    });
  }

}

@NgModule({
  imports: [
    SafePipeModule,
    DxSelectBoxModule,
    DxScrollViewModule
  ],
  providers: [],
  exports: [ServerMonitoringComponent],
  declarations: [ServerMonitoringComponent],
})
export class ServerMonitoringModule {

}

