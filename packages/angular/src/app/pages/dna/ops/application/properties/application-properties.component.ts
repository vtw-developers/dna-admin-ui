import {Component, Input, NgModule} from "@angular/core";
import {DxScrollViewModule, DxTabsModule} from "devextreme-angular";
import {ApplicationEditorModule} from "../editor/application-editor.component";
import {NgIf} from "@angular/common";

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

  tabs = ['Application','Service'];
}

@NgModule({
  imports: [
    DxTabsModule,
    ApplicationEditorModule,
    DxScrollViewModule,
    NgIf
  ],
  providers: [],
  exports: [ApplicationPropertiesComponent],
  declarations: [ApplicationPropertiesComponent]
})
export class ApplicationPropertiesModule {

}
