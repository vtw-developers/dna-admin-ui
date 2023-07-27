import {Component, Input, NgModule} from "@angular/core";
import {DxButtonModule, DxDropDownButtonModule, DxScrollViewModule, DxTextBoxModule} from "devextreme-angular";
import {DxToolbarModule} from "devextreme-angular/ui/toolbar";
import {ExtractFormModule} from "../../../../../components/library/dna/extract-form/extract-form.component";
import {TemplateCardsModule} from "../../../../../components/utils/dna/template-cards/template-cards.component";
import {CardActivitiesModule, CardMessagesModule, CardNotesModule} from "../../../../../components";
import {CommonModule} from "@angular/common";
import {TemplateFormModule} from "../../../../../components/library/dna/template-form/template-form.component";
import {
  DeployedFlowCardsModule
} from "../../../../../components/utils/dna/deployed-flow-cards/deployed-flow-cards.component";
import {Notes} from "../../../../../types/notes";
import {Messages} from "../../../../../types/messages";
import {Opportunities} from "../../../../../types/opportunities";

@Component({
  selector: 'deployed-flow-details',
  templateUrl: './deployed-flow-details.component.html',
  styleUrls: ['./deployed-flow-details.component.scss'],
  providers: [],
})
export class DeployedFlowDetailsComponent {

  navItem;
  @Input() set selectedItem(currentItem) {
    console.log(currentItem)
    this.navItem = currentItem;
  }

  contactData: any;

  contactNotes: Notes;

  contactMessages: Messages;

  activeOpportunities: Opportunities;

  closedOpportunities: Opportunities;

  contactName = 'Loading...';

  isLoading = false;

  constructor() {
  }

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
    DxTextBoxModule,
    DeployedFlowCardsModule,
  ],
  providers: [],
  exports: [DeployedFlowDetailsComponent],
  declarations: [DeployedFlowDetailsComponent],
})
export class DeployedFlowDetailsModule {
}
