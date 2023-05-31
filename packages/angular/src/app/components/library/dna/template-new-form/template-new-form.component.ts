import {
  Component, EventEmitter,
  NgModule, Output,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  DxTextBoxModule,
  DxFormModule,
  DxValidatorModule, DxSelectBoxModule, DxFileUploaderModule,
} from 'devextreme-angular';
import {
  FormTextboxModule,
  FormPhotoUploaderModule,
} from 'src/app/components';
import {newContact} from 'src/app/types/contact';
import {getSizeQualifier} from 'src/app/services/screen.service';
import {AbstractNewFormComponent} from '../abstract-new-form/abstract-new-form.component';
import test from 'node:test';

@Component({
  selector: 'flow-template-new-form',
  templateUrl: './template-new-form.component.html',
  styleUrls: ['./template-new-form.component.scss'],
  providers: [],
})

export class TemplateNewFormComponent extends AbstractNewFormComponent {
  newTemplate = {} as any;
  getSizeQualifier = getSizeQualifier;

  constructor() {
    super();
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
    DxFileUploaderModule,
  ],
  declarations: [TemplateNewFormComponent],
  exports: [TemplateNewFormComponent],
})
export class FlowTemplateNewFormModule {
}
