import {Component, EventEmitter, NgModule, Output} from "@angular/core";
import {
  DxButtonModule,
  DxDateBoxModule,
  DxFormModule,
  DxPopupModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxValidationGroupModule,
  DxValidatorModule
} from "devextreme-angular";
import {FormTextboxModule} from "../../../utils/form-textbox/form-textbox.component";
import {FormPhotoUploaderModule} from "../../../utils/form-photo-uploader/form-photo-uploader.component";
import {CommonModule} from "@angular/common";
import {Apollo, gql} from "apollo-angular";

@Component({
  selector: 'server-new-form',
  templateUrl: './server-new-form.component.html',
  styleUrls: ['/server-new-form.component.scss'],
  providers: [],
})
export class ServerNewFormComponent {

  @Output() saved = new EventEmitter();

  popupVisible = false;
  server = {} as any;
  createMode: boolean;
  os = ['Rocky', 'CentOS', 'Ubuntu Server']

  constructor(private apollo: Apollo) {
  }

  openPopup(server: any) {
    console.log(server);
    if (server === undefined) {
      this.createMode = true;
    } else {
      this.createMode = false;
      this.server = server;
    }
    this.popupVisible = true;
  }

  save(e) {
    if (this.createMode) {

      this.apollo.mutate<any>({
        mutation: gql`
          mutation createServer($server: ServerInput) {
            createServer(server: $server)
          }
        `,
        variables: {
          server: this.server
        }
      }).subscribe((result: any) => {
        if (result.errors) {
          console.error(result.errors);
          return
        }
        this.popupVisible = false;
        this.saved.emit();
      });
    } else {

    }
    this.popupVisible = false;
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
    FormPhotoUploaderModule,

    CommonModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    DxButtonModule,
    DxValidationGroupModule,
    DxPopupModule,
  ],
  providers: [],
  exports: [ServerNewFormComponent],
  declarations: [ServerNewFormComponent],
})
export class ServerNewFormModule { }

