import {Component, EventEmitter, NgModule, Output} from "@angular/core";
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
import {CommonModule} from "@angular/common";
import {Apollo, gql} from "apollo-angular";
import notify from "devextreme/ui/notify";

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
  os = ['Rocky', 'CentOS', 'Ubuntu Server'];

  constructor(private apollo: Apollo) {
  }

  openPopup(server: any) {
    console.log(server)
    this.server = {};
    if (server === undefined) {
      this.createMode = true;
    } else {
      this.createMode = false;
      this.server = server;
    }
    this.popupVisible = true;
  }

  save(e) {
    e.preventDefault();
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
        notify('서버가 성공적으로 저장되었습니다.', 'success', 3000);
        this.popupVisible = false;
        this.saved.emit();
      });
    } else {
      this.apollo.mutate<any>({
        mutation: gql`
          mutation updateServer($server: ServerInput) {
            updateServer(server: $server)
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
        notify('서버가 성공적으로 수정되었습니다.', 'success', 3000);
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

    CommonModule,
    DxSelectBoxModule,
    DxButtonModule,
    DxValidationGroupModule,
    DxPopupModule,
  ],
  providers: [],
  exports: [ServerNewFormComponent],
  declarations: [ServerNewFormComponent],
})
export class ServerNewFormModule { }

