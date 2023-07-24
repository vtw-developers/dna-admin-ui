import {
  Component, ViewChild, NgModule, OnDestroy,
} from '@angular/core';
import {
  DxButtonModule,
  DxDataGridModule,
  DxDataGridComponent,
  DxDropDownButtonModule,
  DxSelectBoxModule,
  DxTextBoxModule,
} from 'devextreme-angular';
import {
  CardActivitiesModule,
  ContactStatusModule,
} from 'src/app/components';
import {ContactStatus,} from 'src/app/types/contact';
import {SelectionChangedEvent} from 'devextreme/ui/drop_down_button';
import DataSource from 'devextreme/data/data_source';
import {CommonModule} from '@angular/common';
import {DataService} from 'src/app/services';
import {FormPopupModule} from 'src/app/components';
import {ContactPanelModule} from 'src/app/components/library/contact-panel/contact-panel.component';
import {of} from 'rxjs';
import {
  ScheduleNewFormComponent,
  ScheduleNewFormModule
} from "../../../components/library/dna/schedule-new-form/schedule-new-form.component";
import {Apollo, gql} from "apollo-angular";

type FilterContactStatus = ContactStatus | 'All';

@Component({
  templateUrl: './flow-history.component.html',
  styleUrls: ['./flow-history.component.scss'],
  providers: [DataService],
})
export class FlowHistoryComponent implements OnDestroy {
  @ViewChild(DxDataGridComponent, {static: true}) dataGrid: DxDataGridComponent;
  @ViewChild(ScheduleNewFormComponent, {static: true}) editSchedulePopup: ScheduleNewFormComponent;

  filterStatusList = ['All', 'Error', 'Success'];
  selectedHistory;
  histories;
  dataSource;
  interval;

  constructor(private service: DataService, private apollo: Apollo) {
    this.reloadFlowHistories();
    this.interval = setInterval(() => {
      this.reloadFlowHistories();
    }, 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  reloadFlowHistories() {
    this.apollo.query<any>({
        query: gql`
            query flowScheduleHistories {
                flowScheduleHistories {
                    id
                    flowName
                    isSuccess
                    fireTime
                    errorMessage
                }
            }
        `
    }).subscribe(result => {
      this.histories = result.data.flowScheduleHistories;
      this.reloadFlowSchedulesDataSource(this.histories);
    });
  }

  reloadFlowSchedulesDataSource(histories) {
    this.dataSource = new DataSource({
      key: 'id',
      store: this.histories,
      load: () => new Promise((resolve, reject) => {
        of(this.histories).subscribe({
          next: (data: any[]) => resolve(data),
          error: ({message}) => reject(message)
        })
      })
    })
  }

  refresh = () => {
    this.dataGrid.instance.refresh();
  };

  clearSelection(e) {
    if (e.target.classList.value === '') {
      this.dataGrid.instance.clearSelection();
      this.selectedHistory = undefined;
    }
  }

  filterByStatus = (e: SelectionChangedEvent) => {
    const {item: status}: { item: FilterContactStatus } = e;
    if (status === 'All') {
      this.dataGrid.instance.clearFilter();
    } else {
      this.dataGrid.instance.filter(['status', '=', status]);
    }
  };
}

@NgModule({
  imports: [
    DxButtonModule,
    DxDataGridModule,
    DxDropDownButtonModule,
    DxSelectBoxModule,
    DxTextBoxModule,

    ContactPanelModule,
    ScheduleNewFormModule,
    FormPopupModule,
    CardActivitiesModule,
    ContactStatusModule,

    CommonModule,
  ],
  providers: [],
  exports: [],
  declarations: [FlowHistoryComponent],
})
export class FlowSchedulerModule {
}
