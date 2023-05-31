import {
  Component, OnInit, NgModule,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  DxButtonModule,
  DxDropDownButtonModule,
  DxScrollViewModule,
} from 'devextreme-angular';
import {
  CardActivitiesModule,
  CardNotesModule,
  CardMessagesModule,
} from 'src/app/components';
import {DataService} from 'src/app/services';
import {forkJoin, map} from 'rxjs';
import {Contact} from 'src/app/types/contact';
import {Messages} from 'src/app/types/messages';
import {Notes} from 'src/app/types/notes';
import {Opportunities} from 'src/app/types/opportunities';
import {ContactFormModule} from 'src/app/components/library/contact-form/contact-form.component';
import {ContactCardsModule} from 'src/app/components/utils/contact-cards/contact-cards.component';
import {DxToolbarModule} from 'devextreme-angular/ui/toolbar';
import {loadMessages, locale} from 'devextreme/localization';
import {formatMessage} from 'devextreme/localization';
import {ExtractFormModule} from '../../../components/library/dna/extract-form/extract-form.component';
import {
  ExtractCardsComponent,
  ExtractCardsModule
} from '../../../components/utils/dna/extract-cards/extract-cards.component';
import {TemplateFormModule} from '../../../components/library/dna/template-form/template-form.component';
import {TemplateCardsModule} from '../../../components/utils/dna/template-cards/template-cards.component';

@Component({
  selector: 'template-details',
  templateUrl: './template-details.component.html',
  styleUrls: ['./template-details.component.scss'],
  providers: [DataService],
})
export class TemplateDetailsComponent implements OnInit {
  contactId = 12;

  contactData: any;

  contactNotes: Notes;

  contactMessages: Messages;

  activeOpportunities: Opportunities;

  closedOpportunities: Opportunities;

  contactName = 'Loading...';

  isLoading = false;

  formatMessage = formatMessage;

  constructor(private service: DataService) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData = () => {
    this.contactName = '자격취득자 추출';
    this.contactData = {
      id: 1,
      name: '변동 테이블 추출 템플릿',
      group: '추출 > 변경 추출',
      description: 'DB 트리거 만들어서 어쩌구저쩌구'
    };
    this.isLoading = false;

    // forkJoin([
    //     this.service.getContactNotes(this.contactId),
    //     this.service.getContactMessages(this.contactId),
    //     this.service.getActiveContactOpportunities(this.contactId),
    //     this.service.getClosedContactOpportunities(this.contactId),
    // ]).pipe(
    //     map(
    //         ([
    //              contactNotes,
    //              contactMessages,
    //              activeOpportunities,
    //              closedOpportunities
    //          ]) => ({
    //             contactNotes,
    //             contactMessages,
    //             activeOpportunities,
    //             closedOpportunities
    //         }))
    // ).subscribe(
    //     (data) => Object.keys(data).forEach((key) => this[key] = data[key])
    // );
    //
    // this.service.getContact(this.contactId).subscribe((data) => {
    //     this.contactName = data.name;
    //     this.contactData = data;
    //     this.isLoading = false;
    // })
  };

  refresh = () => {
    this.isLoading = true;
    this.loadData();
  };
}

@NgModule({
  imports: [
    DxButtonModule,
    DxDropDownButtonModule,
    DxScrollViewModule,
    DxToolbarModule,

    ExtractFormModule,
    TemplateCardsModule,

    CardActivitiesModule,
    CardNotesModule,
    CardMessagesModule,

    CommonModule,
    TemplateFormModule,
  ],
  providers: [],
  exports: [
    TemplateDetailsComponent
  ],
  declarations: [TemplateDetailsComponent],
})
export class TemplateDetailsModule {
}
