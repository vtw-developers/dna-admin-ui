import {Component, Input, NgModule} from "@angular/core";
import {DxButtonModule, DxDataGridModule, DxTabPanelModule} from "devextreme-angular";
import {ExtractSourceModule} from "../../../library/dna/card-extract-source/card-extract-source.component";
import {CardNotesModule} from "../../../library/card-notes/card-notes.component";
import {CardMessagesModule} from "../../../library/card-messages/card-messages.component";
import {CardActivitiesModule} from "../../../library/card-activities/card-activities.component";
import {CardOpportunitiesModule} from "../../../library/card-opportunities/card-opportunities.component";
import {CardTasksModule} from "../../../library/card-tasks/card-tasks.component";
import {CommonModule} from "@angular/common";
import {CardWorkflowModule} from "../../../library/dna/card-workflow/card-workflow.component";
import {Activity} from "../../../../types/activities";
import {Opportunities} from "../../../../types/opportunities";

@Component({
  selector: 'deployed-flow-cards',
  templateUrl: './deployed-flow-cards.component.html',
  styleUrls: ['./deployed-flow-cards.component.scss'],
})
export class DeployedFlowCardsComponent {

  @Input() activities: Activity[];

  @Input() activeOpportunities: Opportunities;

  @Input() closedOpportunities: Opportunities;

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
    CardWorkflowModule,
  ],
  providers: [],
  exports: [DeployedFlowCardsComponent],
  declarations: [DeployedFlowCardsComponent],
})
export class DeployedFlowCardsModule { }
