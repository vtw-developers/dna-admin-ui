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
} from "../../../../../components/library/dna/server-new-form/server-new-form.component";
import {ContactStatusModule, FormPhotoUploaderModule, FormTextboxModule} from "../../../../../components";
import {CommonModule} from "@angular/common";
import {DxiColumnModule} from "devextreme-angular/ui/nested";
import {confirm} from "devextreme/ui/dialog";
import DataSource from "devextreme/data/data_source";
import notify from "devextreme/ui/notify";

@Component({
  templateUrl: './server-list.component.html',
  styleUrls: ['./server-list.component.scss'],
  providers: []
})
export class ServerListComponent {
  @ViewChild(DxDataGridComponent, {static: false}) grid: DxDataGridComponent;
  @ViewChild(ServerNewFormComponent, {static: false}) editServerPopup: ServerNewFormComponent;

  // statusList = ['Running', 'Stopped']
  serverId;
  selectedServer;
  servers: DataSource;
  isSelected: boolean;

  constructor(private apollo: Apollo) {
    this.reloadServers();
  }
   /*dataSource = new DataSource<Contact[], string>({
     key: 'id',
     load: () => new Promise((resolve, reject) => {
       of(result.data.servers).subscribe({
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

  reloadServers() {
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
      /*result.data.servers.forEach(server => {
        server.status = 'Stopped';
      })*/
      this.servers = result.data.servers;
      console.log(this.servers)
    });
  }

  refresh = () => {
    this.serverId = null;
    this.selectedServer = undefined;
    this.isSelected = false;
    this.reloadServers();
    /*this.grid.instance.getDataSource().reload();
    this.grid.instance.refresh();*/
    // this.servers.reload();
  };

  rowClick(e: RowClickEvent) {
    const {data} = e;
    this.selectedServer = data;
    this.serverId = data.id;
    this.isSelected = true;
  }

  openAddServer() {
    /*const checkedRow = this.dataGrid.instance.getSelectedRowKeys();
    console.log(this.dataGrid.selectedRowKeys);
    if(this.selectedServer === undefined && checkedRow.length > 0) {
      this.selectedServer = this.servers.find(item => item.id === checkedRow[checkedRow.length - 1]);
      console.log(this.selectedServer);
    }*/
    this.editServerPopup.openPopup(this.selectedServer);
  }

  delete() {
    const result = confirm('<i>정말로 서버를 삭제하시겠습니까?</i>', '서버 삭제');
    result.then(dialogResult => {
      if (dialogResult) {
        this.apollo.mutate({
          mutation: gql`
            mutation deleteServer($id: ID) {
              deleteServer(id: $id)
            }
          `,
          variables: {
            id: this.serverId
          }
        }).subscribe((result: any) => {
          if (result.errors) {
            console.error(result.errors);
          }
          console.log(result);
          notify('서버 삭제가 완료되었습니다.', 'success', 3000);
          this.refresh();
        });
      }
    });
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
    ContactStatusModule,
  ],
  providers: [],
  exports: [ServerListComponent],
  declarations: [ServerListComponent],
})
export class ServerListModule {
}
