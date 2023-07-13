import {Component, NgModule, ViewChild} from "@angular/core";
import {
  DxButtonModule,
  DxDataGridComponent,
  DxDataGridModule,
  DxDateBoxModule,
  DxFormModule,
  DxPopupModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxValidationGroupModule,
  DxValidatorModule
} from "devextreme-angular";
import {RowClickEvent} from "devextreme/ui/data_grid";
import {Apollo, gql} from "apollo-angular";
import {
  ServerNewFormComponent,
  ServerNewFormModule
} from "../../../../components/library/dna/server-new-form/server-new-form.component";
import {FormPhotoUploaderModule, FormTextboxModule} from "../../../../components";
import {CommonModule} from "@angular/common";
import {DxiColumnModule} from "devextreme-angular/ui/nested";

@Component({
  templateUrl: './server-editor.component.html',
  styleUrls: ['./server-editor.component.scss'],
  providers: []
})
export class ServerEditorComponent {
  @ViewChild(DxDataGridComponent, {static: true}) dataGrid: DxDataGridComponent;
  @ViewChild(ServerNewFormComponent, {static: false}) editServerPopup: ServerNewFormComponent;

  serverName;
  selectedServer;
  servers;

  /*servers = [
    {
      id: 1,
      name: 'Server1',
      status: 'Running',
      os: 'Rocky',
      privateIp: '192.192.192.192',
      publicIp: '192.192.192.192'
    },
    {
      id: 2,
      name: 'Server2',
      status: 'Error',
      os: 'CentOS',
      privateIp: '192.192.192.192',
      publicIp: '192.192.192.192'
    },
    {
      id: 3,
      name: 'Server3',
      status: 'Stopped',
      os: 'Ubuntu',
      privateIp: '192.192.192.192',
      publicIp: '192.192.192.192'
    }
  ]*/


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
      console.log(result);
      this.servers = result.data.servers;
    });

  }

 /* dataSource = new DataSource<Contact[], string>({
    key: 'id',
    load: () => new Promise((resolve, reject) => {
      of(this.servers).subscribe({
        next: (data: any[]) => resolve(data),
        error: ({message}) => reject(message)
      })
    }),
    // load: () => new Promise((resolve, reject) => {
    //     this.service.getContacts().subscribe({
    //         next: (data: Contact[]) => {
    //             console.log(data);
    //             resolve(data)
    //         },
    //         error: ({message}) => reject(message)
    //     })
    // }),
  });*/


  refresh = () => {
    this.dataGrid.instance.getDataSource().reload();
  };

  rowClick(e: RowClickEvent) {
    const {data} = e;
    this.selectedServer = data;
    this.serverName = data.name;
  }

  openAddServer() {
    const checkedRow = this.dataGrid.instance.getSelectedRowKeys()
    if(this.selectedServer === undefined && checkedRow.length > 0) {
      this.selectedServer = this.servers.find(item => item.id === checkedRow[checkedRow.length - 1]);
      console.log(this.selectedServer);
    }
    this.editServerPopup.openPopup(this.selectedServer);
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
    ServerNewFormModule,
    DxiColumnModule,
    DxDataGridModule,
  ],
  providers: [],
  exports: [ServerEditorComponent],
  declarations: [ServerEditorComponent],
})
export class ServerEditorModule { }
