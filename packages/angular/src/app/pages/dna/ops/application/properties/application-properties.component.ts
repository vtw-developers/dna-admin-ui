import {Component, Input, NgModule} from "@angular/core";
import {DxScrollViewModule, DxTabsModule} from "devextreme-angular";
import {NgIf} from "@angular/common";
import {ApplicationEditorModule} from "../editor/application-editor.component";
import {ApplicationMonitoringModule} from "../monitoring/application-monitoring.component";

@Component({
  selector: 'application-properties',
  templateUrl: './application-properties.component.html',
  providers: []
})
export class ApplicationPropertiesComponent {

  navItem;
  @Input() set selectedItem(currentItem) {
    console.log(currentItem)
    this.navItem = currentItem;
  }

  tabs = [
    {
      id: 0,
      text: 'Application',
      icon: '/assets/icons/common/application.svg',
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
    ApplicationEditorModule,
    ApplicationMonitoringModule
  ],
  providers: [],
  exports: [ApplicationPropertiesComponent],
  declarations: [ApplicationPropertiesComponent]
})
export class ApplicationPropertiesModule {

}
