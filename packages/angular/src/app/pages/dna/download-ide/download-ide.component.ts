import {Component, NgModule} from "@angular/core";
import {
  DxButtonModule,
} from "devextreme-angular";
import {CommonModule} from "@angular/common";
import {HttpClient} from "@angular/common/http";

@Component({
  templateUrl: 'download-ide.component.html',
})
export class DownloadIdeComponent {

  constructor(private httpClient: HttpClient) {
  }

  download() {
    this.httpClient.get('assets/files/test.exe', {responseType: 'arraybuffer'}).subscribe(data => {
      const blob = new Blob([new Uint8Array(data)], {type: 'application/vnd.microsoft.portable-executable'});
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `test.exe`;
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    });
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