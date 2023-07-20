import {Component, Input, NgModule} from "@angular/core";
import {DxScrollViewModule, DxTabsModule} from "devextreme-angular";
import {ApplicationEditorModule} from "../../application/editor/application-editor.component";
import {NgIf} from "@angular/common";
import {ServerMonitoringModule} from "../monitoring/server-monitoring.component";

@Component({
  selector: 'server-properties',
  templateUrl: './server-properties.component.html',
  providers: []
})
export class ServerPropertiesComponent {
  navItem;
  @Input() set selectedItem(currentItem) {
    console.log(currentItem)
    this.navItem = currentItem;
  }

  tabs = [
    {
      id: 0,
      text: 'Server',
      icon: '/assets/icons/common/server.svg',
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
    ApplicationEditorModule,
    DxScrollViewModule,
    NgIf,
    ServerMonitoringModule
  ],
  providers: [],
  exports: [ServerPropertiesComponent],
  declarations: [ServerPropertiesComponent]
})
export class ServerPropertiesModule {

}
