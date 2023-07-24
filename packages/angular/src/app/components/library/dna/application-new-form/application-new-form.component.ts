import {Component, EventEmitter, NgModule, OnInit, Output} from "@angular/core";
import {Apollo, gql} from "apollo-angular";
import {
  DxButtonModule,
  DxFormModule,
  DxPopupModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxValidationGroupModule,
  DxValidatorModule
} from "devextreme-angular";
import {FormTextboxModule} from "../../../utils/form-textbox/form-textbox.component";
import notify from "devextreme/ui/notify";

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
  }

  openPopup(application: any, serverId: any) {
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

      this.application = {}
      const server = this.servers.find(e => e.id === serverId);
      if (application === undefined) {
        this.createMode = true;
        this.application.server = server;
      } else {
        this.createMode = false;
        application.server = server;
        this.application = application;
      }
      this.popupVisible = true;
    });
  }

  save(e) {
    e.preventDefault();
    console.log(this.application)
    if (this.createMode) {
      this.apollo.mutate<any>({
        mutation: gql`
          mutation createApplication($application: ApplicationInput) {
            createApplication(application: $application)
          }
        `,
        variables: {
          application: this.application
        }
      }).subscribe((result: any) => {
        if (result.errors) {
          console.error(result.errors);
          return
        }
        notify('애플리케이션이 성공적으로 저장되었습니다.', 'success', 3000);
        this.popupVisible = false;
        this.saved.emit();
      });
    } else {
      this.apollo.mutate<any>({
        mutation: gql`
          mutation updateApplication($application: ApplicationInput) {
            updateApplication(application: $application)
          }
        `,
        variables: {
          application: this.application
        }
      }).subscribe((result: any) => {
        if (result.errors) {
          console.error(result.errors);
          return
        }
        notify('애플리케이션이 성공적으로 수정되었습니다.', 'success', 3000);
        this.popupVisible = false;
        this.saved.emit();
      });
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
    DxValidatorModule,

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
