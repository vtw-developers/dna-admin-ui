import {
  Component,
  NgModule,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  DxTextBoxModule,
  DxFormModule,
  DxValidatorModule, DxSelectBoxModule,
} from 'devextreme-angular';
import {
  FormTextboxModule,
  FormPhotoUploaderModule,
} from 'src/app/components';
import {newContact} from 'src/app/types/contact';
import {getSizeQualifier} from 'src/app/services/screen.service';

@Component({
  selector: 'extract-new-form',
  templateUrl: './extract-new-form.component.html',
  providers: [],
})

export class ExtractNewFormComponent {
  newUser = {} as any;
  getSizeQualifier = getSizeQualifier;

  constructor() {
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
  ],
  declarations: [ExtractNewFormComponent],
  exports: [ExtractNewFormComponent],
})
export class ExtractNewFormModule {
}
