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

@Component({
  selector: 'extract-details',
  templateUrl: './extract-details.component.html',
  styleUrls: ['./extract-details.component.scss'],
  providers: [DataService],
})
export class ExtractDetailsComponent implements OnInit {
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
      system: '대한상공회의소',
      name: '자격취득자 추출',
      template: '변동 테이블 추출',
      source: '자격취득자정보[TB_A001]',
      target: '자격취득인적정보[PERSON]',
      status: 'Error',
      lastRunDate: '2023-05-23 14:13:25',
      recentCount: 2342034
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
    ExtractCardsModule,

    CardActivitiesModule,
    CardNotesModule,
    CardMessagesModule,

    CommonModule,
  ],
  providers: [],
  exports: [
    ExtractDetailsComponent
  ],
  declarations: [ExtractDetailsComponent],
})
export class ExtractDetailsModule {
}
