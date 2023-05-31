import {
  Component, EventEmitter,
  NgModule, Output,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  DxTextBoxModule,
  DxFormModule,
  DxValidatorModule, DxSelectBoxModule, DxFileUploaderModule, DxButtonModule,
} from 'devextreme-angular';
import {
  FormTextboxModule,
  FormPhotoUploaderModule,
} from 'src/app/components';
import {newContact} from 'src/app/types/contact';
import {getSizeQualifier} from 'src/app/services/screen.service';
import test from 'node:test';
import {AbstractNewFormComponent} from '../abstract-new-form/abstract-new-form.component';

@Component({
  selector: 'group-new-form',
  templateUrl: './group-new-form.component.html',
  styleUrls: ['./group-new-form.component.scss'],
  providers: [],
})

export class GroupNewFormComponent extends AbstractNewFormComponent {
  newGroup = {} as any;
  getSizeQualifier = getSizeQualifier;

  constructor() {
    super();
    console.log('hel');
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
    DxButtonModule,
  ],
  declarations: [GroupNewFormComponent],
  exports: [GroupNewFormComponent],
})
export class GroupNewFormModule {
}
