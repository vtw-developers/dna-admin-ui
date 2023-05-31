import { CommonModule } from '@angular/common';
import {
  Component, NgModule, Input, SimpleChanges, OnInit, OnChanges,
} from '@angular/core';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxListModule } from 'devextreme-angular/ui/list';
import { DxLoadPanelModule } from 'devextreme-angular/ui/load-panel';
import { CardMenuModule } from '../../card-menu/card-menu.component';
import { Activity } from 'src/app/types/activities';
import {CardActivitiesModule} from '../../card-activities/card-activities.component';
import {
    DxAccordionModule,
    DxFormModule,
    DxScrollViewModule, DxTextBoxModule,
    DxToolbarModule,
    DxValidationGroupModule, DxValidatorModule
} from 'devextreme-angular';
import {ContactStatusModule} from '../../../utils/contact-status/contact-status.component';
import {DxoColCountByScreenModule} from 'devextreme-angular/ui/nested';
import {FormPhotoModule} from '../../../utils/form-photo/form-photo.component';
import {FormTextboxModule} from '../../../utils/form-textbox/form-textbox.component';

@Component({
  selector: 'extract-source',
  templateUrl: './card-extract-source.component.html',
  styleUrls: ['./card-extract-source.component.scss'],
})
export class CardExtractSourceComponent {
  @Input() activities: Activity[];

  @Input() showBy? = false;

  @Input() isLoading: boolean = false;

  activityMenuItems: Array<{ text: string }> = [
    { text: 'View details' },
    { text: 'Delete' },
  ];
    contactData = {
        id: 1,
        system: '대한상공회의소',
        name: '자격취득자 추출',
        template: '변동 테이블 추출',
        source: '자격취득자정보[TB_A001]',
        target: '자격취득인적정보[PERSON]',
        status: 'Error',
        lastRunDate: '2023-05-23 14:13:25',
        recentCount: 2342034
    };
}

@NgModule({
    imports: [
        DxListModule,
        DxButtonModule,
        DxLoadPanelModule,
        CardMenuModule,

        CommonModule,
        CardActivitiesModule,
        DxAccordionModule,
        ContactStatusModule,
        DxFormModule,
        DxScrollViewModule,
        DxToolbarModule,
        DxValidationGroupModule,
        DxoColCountByScreenModule,
        FormPhotoModule,
        FormTextboxModule,
        DxTextBoxModule,
        DxValidatorModule,
    ],
  declarations: [CardExtractSourceComponent],
  exports: [CardExtractSourceComponent],
})
export class ExtractSourceModule { }
