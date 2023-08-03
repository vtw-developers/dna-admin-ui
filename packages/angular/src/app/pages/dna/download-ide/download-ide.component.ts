import {Component, NgModule} from "@angular/core";
import {
  DxButtonModule,
} from "devextreme-angular";
import {CommonModule} from "@angular/common";
import {Apollo, gql} from "apollo-angular";

@Component({
  templateUrl: 'download-ide.component.html',
})
export class DownloadIdeComponent {

  constructor(private apollo: Apollo) {
  }

  download() {
    this.apollo.mutate<any>({
        mutation: gql`
            mutation downloadIde {
                downloadIde
            }
        `
    }).subscribe(result => {
      const bytes = result.data.downloadIde;
      const blob = new Blob([new Uint8Array(bytes)], {type: 'application/vnd.microsoft.portable-executable'});
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `DnASetup.exe`
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url);
    })
  }

}

@NgModule({
  imports: [
    DxButtonModule,
    CommonModule,
  ],
  providers: [],
  exports: [],
  declarations: [DownloadIdeComponent],
})
export class DownloadIdeModule {
}