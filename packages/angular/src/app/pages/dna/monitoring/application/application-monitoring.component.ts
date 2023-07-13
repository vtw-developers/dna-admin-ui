import {Component, NgModule} from "@angular/core";
import {SafePipeModule} from "../../../../pipes/SafePipe";
import {DxSelectBoxModule} from "devextreme-angular";
import {Apollo} from "apollo-angular";

@Component({
  templateUrl: './application-monitoring.component.html',
  providers: []
})
export class ApplicationMonitoringComponent {

  monitoringUrl = '';
  applications;

  constructor(private apollo: Apollo) {

  }

}

@NgModule({
  imports: [
    SafePipeModule,
    DxSelectBoxModule
  ],
  providers: [],
  exports: [ApplicationMonitoringComponent],
  declarations: [ApplicationMonitoringComponent]
})
export class ApplicationMonitoringModule {

}
