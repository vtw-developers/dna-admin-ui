import {
  Component, NgModule, Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DxButtonModule,
  DxTabPanelModule,
  DxDataGridModule,
} from 'devextreme-angular';
import {
  CardNotesModule,
  CardMessagesModule,
  CardActivitiesModule,
  CardOpportunitiesModule,
  CardTasksModule,
} from 'src/app/components';
import { Activity } from 'src/app/types/activities';
import { Messages } from 'src/app/types/messages';
import { Notes } from 'src/app/types/notes';
import { Opportunities } from 'src/app/types/opportunities';
import { Task } from 'src/app/types/task';
import {ExtractSourceModule} from '../../../library/dna/card-extract-source/card-extract-source.component';

@Component({
  selector: 'extract-cards',
  templateUrl: './extract-cards.component.html',
  styleUrls: ['./extract-cards.component.scss'],
})
export class ExtractCardsComponent {
    @Input() tasks: Task[];

    @Input() activities: Activity[];

    @Input() activeOpportunities: Opportunities;

    @Input() closedOpportunities: Opportunities;

    @Input() notes: Notes;

    @Input() messages: Messages;

    @Input() contactName: string;

    @Input() isLoading: boolean;
}

@NgModule({
  imports: [
    DxButtonModule,
    DxTabPanelModule,
    DxDataGridModule,

    ExtractSourceModule,

    CardNotesModule,
    CardMessagesModule,
    CardActivitiesModule,
    CardOpportunitiesModule,
    CardTasksModule,

    CommonModule,
  ],
  providers: [],
  exports: [ExtractCardsComponent],
  declarations: [ExtractCardsComponent],
})
export class ExtractCardsModule { }
