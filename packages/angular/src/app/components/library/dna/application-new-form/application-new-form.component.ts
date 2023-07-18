import {Component, EventEmitter, NgModule, Output} from "@angular/core";
import {Apollo, gql} from "apollo-angular";
import {
  DxButtonModule,
  DxFormModule,
  DxPopupModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxValidationGroupModule
} from "devextreme-angular";
import {FormTextboxModule} from "../../../utils/form-textbox/form-textbox.component";

@Component({
  selector: 'application-new-form',
  templateUrl: './application-new-form.component.html',
  styleUrls: ['/application-new-form.component.scss'],
  providers: [],
})
export class ApplicationNewFormComponent {
  @Output() saved = new EventEmitter();

  popupVisible = false;
  application = {} as any;
  createMode: boolean;
  servers;


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
      console.log(result.data.servers);
      this.servers = result.data.servers;
    });
  }

  openPopup(application: any) {
    console.log(application);
    this.application = {};
    if (application === undefined) {
      this.createMode = true;
    } else {
      this.createMode = false;
      this.application = application;
    }
    this.popupVisible = true;
  }

  save(e) {
    console.log(this.application);
    e.preventDefault();
    if (this.createMode) {

    } else {

    }
  }


  cancel = () => {
    this.popupVisible = false;
  }

}

@NgModule({
  imports: [
    DxTextBoxModule,
    DxFormModule,

    FormTextboxModule,

    DxSelectBoxModule,
    DxValidationGroupModule,
    DxPopupModule,
    DxButtonModule,
  ],
  providers: [],
  exports: [ApplicationNewFormComponent],
  declarations: [ApplicationNewFormComponent]
})
export class ApplicationNewFormModule {
}
