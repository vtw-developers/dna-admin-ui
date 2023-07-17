import {
  Component, ViewChild, NgModule,
} from '@angular/core';
import {
  DxButtonModule,
  DxDataGridModule,
  DxDataGridComponent,
  DxDropDownButtonModule,
  DxSelectBoxModule,
  DxTextBoxModule,
} from 'devextreme-angular';
import {RowClickEvent} from 'devextreme/ui/data_grid';
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
  templateUrl: './flow-scheduler.component.html',
  styleUrls: ['./flow-scheduler.component.scss'],
  providers: [DataService],
})
export class FlowSchedulerComponent {
  @ViewChild(DxDataGridComponent, {static: true}) dataGrid: DxDataGridComponent;
  @ViewChild(ScheduleNewFormComponent, {static: true}) editSchedulePopup: ScheduleNewFormComponent;

  filterStatusList = ['All', 'Running', 'Stopped', 'Error', 'Not Started'];
  isPanelOpened = false;
  flowName;
  schedule;
  selectedSchedule;
  schedules;
  dataSource;

  constructor(private service: DataService, private apollo: Apollo) {
    this.reloadFlowSchedules();
  }

  reloadFlowSchedules() {
    this.apollo.query<any>({
      query: gql`
        query flowSchedules {
          flowSchedules {
              id
              flowName
              status
              cronExpression
              nextFireTime
              prevFireTime
              startTime
          }
        }
      `
    }).subscribe(result => {
      this.schedules = result.data.flowSchedules;
      this.reloadFlowSchedulesDataSource(this.schedules);
    });
  }

  reloadFlowSchedulesDataSource(schedules) {
    this.dataSource = new DataSource({
      key: 'id',
      store: this.schedules,
      load: () => new Promise((resolve, reject) => {
        of(this.schedules).subscribe({
          next: (data: any[]) => resolve(data),
          error: ({message}) => reject(message)
        })
      })
    })
  }

  openAddSchedule() {
    const checkedRow = this.dataGrid.instance.getSelectedRowKeys()
    // 다중 체크처리 적용 예정
    if(this.selectedSchedule === undefined && checkedRow.length > 0) {
      this.selectedSchedule = this.schedules.find(item => item.id === checkedRow[0]);
    }
    const newId = this.dataGrid.instance.getDataSource().items().length + 1;
    this.editSchedulePopup.openPopup(this.selectedSchedule, newId);
  };

  addSchedule(flowSchedule: any) {
    this.apollo.mutate<any>({
      mutation: gql`
        mutation createFlowSchedule($flowSchedule: FlowScheduleInput) {
          createFlowSchedule(flowSchedule: $flowSchedule) {
            id
            flowName
            status
            cronExpression
            nextFireTime
            prevFireTime
            startTime
          }
        }
      `,
      variables: {
        flowSchedule
      }
    }).subscribe(result => {
      this.reloadFlowSchedules();
    });
  }

  updateSchedule(flowSchedule: any) {
    this.apollo.mutate<any>({
      mutation: gql`
        mutation updateFlowSchedule($flowSchedule: FlowScheduleInput) {
          updateFlowSchedule(flowSchedule: $flowSchedule) {
              id
              flowName
              status
              cronExpression
              nextFireTime
              prevFireTime
              startTime
          }
        }
      `,
      variables: {
        flowSchedule
      }
    }).subscribe(result => {
      this.reloadFlowSchedules();
    });
  }

  startSchedule() {
    const selectedScheduleKeys = this.dataGrid.instance.getSelectedRowKeys();
    this.selectedSchedule = this.schedules.find(s => s.id === selectedScheduleKeys[0]);
    console.log(this.selectedSchedule);

    this.apollo.mutate<any>({
        mutation: gql`
            mutation startFlowSchedule($flowSchedule: FlowScheduleInput) {
                startFlowSchedule(flowSchedule: $flowSchedule) {
                    id
                    flowName
                    status
                    cronExpression
                    nextFireTime
                    prevFireTime
                    startTime
                }
            }
        `,
      variables: {
        flowSchedule : this.selectedSchedule
      }
    }).subscribe(result => {
      this.reloadFlowSchedules();
    });
  }

  stopSchedule() {
    const selectedScheduleKeys = this.dataGrid.instance.getSelectedRowKeys();
    this.selectedSchedule = this.schedules.find(s => s.id === selectedScheduleKeys[0]);
    // 다중체크 list 넘겨서 back에서 반복 처리하도록 변경 예정
    this.apollo.mutate<any>({
        mutation: gql`
            mutation stopFlowSchedule($flowSchedule: FlowScheduleInput) {
                stopFlowSchedule(flowSchedule: $flowSchedule) {
                    id
                    flowName
                    status
                    cronExpression
                    nextFireTime
                    prevFireTime
                    startTime
                }
            }
        `,
      variables: {
        flowSchedule : this.selectedSchedule
      }
    }).subscribe(result => {
      this.reloadFlowSchedules();
    });
  }

  deleteSchedule() {
    const selectedScheduleKeys = this.dataGrid.instance.getSelectedRowKeys();
    this.selectedSchedule = this.schedules.find(s => s.id === selectedScheduleKeys[0]);

    this.apollo.mutate<any>({
      mutation: gql`
        mutation deleteFlowSchedule($flowSchedule: FlowScheduleInput) {
            deleteFlowSchedule(flowSchedule: $flowSchedule) {
              id
              flowName
              status
              cronExpression
              nextFireTime
              prevFireTime
              startTime
          }
        }
      `,
      variables: {
        flowSchedule : this.selectedSchedule
      }
    }).subscribe(result => {
      this.reloadFlowSchedules();
    });
  }

  refresh = () => {
    this.dataGrid.instance.refresh();
  };

  rowClick(e: RowClickEvent) {
    const {data} = e;
    this.selectedSchedule = data;
    this.flowName = data.flow;
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
  declarations: [FlowSchedulerComponent],
})
export class FlowSchedulerModule {
}
