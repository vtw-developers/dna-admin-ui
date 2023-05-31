import {
  Component, NgModule, Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DxButtonModule,
  DxFormModule,
  DxLoadPanelModule,
  DxNumberBoxModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxToolbarModule,
  DxValidatorModule,
  DxValidationGroupModule,
} from 'devextreme-angular';
import {
  ContactStatusModule,
  FormTextboxModule,
  FormPhotoModule,
  StatusSelectBoxModule,
} from 'src/app/components';
import { Contact } from 'src/app/types/contact';
import { ValidationRule } from 'devextreme/ui/validation_rules';
import { ClickEvent } from 'devextreme/ui/button';
import { ToolbarFormModule } from 'src/app/components/utils/toolbar-form/toolbar-form.component';

@Component({
  selector: 'template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.scss'],
})
export class TemplateFormComponent {
  @Input() contactData: any;

  @Input() isLoading: boolean;

  savedData: Contact = null;

  isEditing = false;

  zipCodeValidator: ValidationRule = { type: 'pattern', pattern: /^\d{5}$/, message: 'Zip is invalid' };

  handleEditClick() {
    this.savedData = { ...this.contactData };
    this.isEditing = true;
  }

  handleSaveClick({ validationGroup }: ClickEvent) {
    if(!validationGroup.validate().isValid) return;
    this.isEditing = false;
    this.savedData = null;
  }

  handleCancelClick() {
    this.contactData = { ...this.savedData };
    this.isEditing = false;
  }
}

@NgModule({
  imports: [
    DxFormModule,
    DxSelectBoxModule,
    DxButtonModule,
    DxTextBoxModule,
    DxNumberBoxModule,
    DxLoadPanelModule,
    DxValidationGroupModule,

    FormTextboxModule,
    ContactStatusModule,
    FormPhotoModule,
    DxValidatorModule,
    ToolbarFormModule,
    CommonModule,
    StatusSelectBoxModule,
  ],
  providers: [],
  exports: [TemplateFormComponent],
  declarations: [TemplateFormComponent],
})
export class TemplateFormModule { }
