import {NgModule, Pipe, PipeTransform} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";

@Pipe({
  name: 'safe',
})
export class SafePipe implements PipeTransform {
  constructor(
    private sanitizer: DomSanitizer
  ) {
  }

  //iframe
  transform(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@NgModule({
  imports: [],
  providers: [],
  exports: [SafePipe],
  declarations: [SafePipe],
})
export class SafePipeModule { }
