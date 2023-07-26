import {Component, Input, NgModule} from "@angular/core";
import {DxScrollViewModule, DxTabsModule} from "devextreme-angular";
import {NgIf} from "@angular/common";
import {DeployedFlowMonitoringModule} from "../monitoring/deployed-flow-monitoring.component";

@Component({
  selector: 'deployed-flow-properties',
  templateUrl: './deployed-flow-properties.component.html',
  providers: []
})
export class DeployedFlowPropertiesComponent {

  navItem;
  @Input() set selectedItem(currentItem) {
    console.log(currentItem)
    this.navItem = currentItem;
  }

  tabs = [
    {
      id: 0,
      text: 'Service',
      icon: '/assets/icons/common/service.svg',
    },
    {
      id: 1,
      text: 'Monitoring',
      icon: '/assets/icons/common/monitoring.svg',
    }
  ];
}

@NgModule({
  imports: [
    DxTabsModule,
    DxScrollViewModule,
    NgIf,
    DeployedFlowMonitoringModule,
  ],
  providers: [],
  exports: [DeployedFlowPropertiesComponent],
  declarations: [DeployedFlowPropertiesComponent]
})
export class DeployedFlowPropertiesModule {

}
