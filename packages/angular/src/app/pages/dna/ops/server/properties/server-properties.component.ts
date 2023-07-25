import {Component, EventEmitter, Input, NgModule, Output} from "@angular/core";
import {DxScrollViewModule, DxTabsModule} from "devextreme-angular";
import {NgIf} from "@angular/common";
import {ServerMonitoringModule} from "../monitoring/server-monitoring.component";
import {ServerEditorModule} from "../editor/server-editor.component";

@Component({
  selector: 'server-properties',
  templateUrl: './server-properties.component.html',
  providers: []
})
export class ServerPropertiesComponent {

  @Output() saved = new EventEmitter();

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

  refresh() {
    this.saved.emit();
  }
}

@NgModule({
  imports: [
    DxTabsModule,
    DxScrollViewModule,
    NgIf,
    ServerMonitoringModule,
    ServerEditorModule,
  ],
  providers: [],
  exports: [ServerPropertiesComponent],
  declarations: [ServerPropertiesComponent]
})
export class ServerPropertiesModule {

}
