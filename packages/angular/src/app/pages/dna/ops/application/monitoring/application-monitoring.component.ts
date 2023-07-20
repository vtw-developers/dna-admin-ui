import {Component, NgModule} from "@angular/core";
import {SafePipeModule} from "../../../../../pipes/SafePipe";
import {DxScrollViewModule, DxSelectBoxModule} from "devextreme-angular";
import {Apollo, gql} from "apollo-angular";
import DataSource from "devextreme/data/data_source";
import ArrayStore from "devextreme/data/array_store";

@Component({
  selector: 'application-monitoring',
  templateUrl: './application-monitoring.component.html',
  providers: []
})
export class ApplicationMonitoringComponent {

  monitoringUrl = 'https://133.186.222.243:3000/grafana/d/JXj23h14k/jvm-micrometer?orgId=1&kiosk';
  applications;

  constructor(private apollo: Apollo) {

    this.apollo.query({
      query: gql`
        query findAllApplications {
          findAllApplications {
            id
            name
            restPort
            monitorPort
            server {
              name
            }
          }
        }
      `,
      variables: {}
    }).subscribe((result: any) => {
      if (result.errors) {
        console.error(result.errors);
      }
      console.log(result);
      this.applications = new DataSource({
        store: new ArrayStore({
          data: result.data.findAllApplications,
          key: 'id',
        }),
        group: 'server.name',
      });
    });
  }

  changeMonitoringUrl(e) {
    console.log(e);
  }

}

@NgModule({
  imports: [
    SafePipeModule,
    DxSelectBoxModule,
    DxScrollViewModule
  ],
  providers: [],
  exports: [ApplicationMonitoringComponent],
  declarations: [ApplicationMonitoringComponent]
})
export class ApplicationMonitoringModule {

}
