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
import {confirm} from 'devextreme/ui/dialog';

type FilterContactStatus = ContactStatus | 'All';

@Component({
  templateUrl: './flow-scheduler.component.html',
  styleUrls: ['./flow-scheduler.component.scss'],
  providers: [DataService],
})
export class FlowSchedulerComponent implements OnDestroy {
  @ViewChild(DxDataGridComponent, {static: true}) dataGrid: DxDataGridComponent;
  @ViewChild(ScheduleNewFormComponent, {static: true}) editSchedulePopup: ScheduleNewFormComponent;

  filterStatusList = ['All', 'Running', 'Stopped', 'Error', 'Not Started'];
  isPanelOpened = false;
  flowName;
  schedule;
  selectedSchedule;
  schedules;
  dataSource;
  interval;

  constructor(private service: DataService, private apollo: Apollo) {
    this.reloadFlowSchedules();
    this.interval = setInterval(() => {
      this.reloadFlowSchedules();
    }, 3000);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
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
    this.selectedSchedule = undefined;
    if (this.dataGrid.instance.getSelectedRowsData().length > 0) {
      this.selectedSchedule = this.dataGrid.instance.getSelectedRowsData()[0];
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
    this.apollo.query<any>({
      query: gql`
        query flowSchedule($flowSchedule: FlowScheduleInput) {
          flowSchedule(flowSchedule: $flowSchedule) {
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
        flowSchedule: flowSchedule
      }
    }).subscribe(result => {
      const oldOne = result.data.flowSchedule;
      if (oldOne.cronExpression === flowSchedule.cronExpression) {
        confirm('<i>변경된 사항이 없습니다.</i>', '변경사항 없음');
      } else {
        if (oldOne.status === 'Stopped') {
          this.updateExecute(flowSchedule);
        } else if (oldOne.status === 'Running') {
          const result = confirm('<i>실행중인 스케줄입니다. 실행을 중지하고 변경하시겠습니까?</i>', '실행중인 스케줄');
          result.then(dialogResult => {
            if(dialogResult) {
              this.updateExecute(flowSchedule);
            }
          })
        }
        this.updateExecute(flowSchedule);
      }
    });
  }

  updateExecute(flowSchedule: any) {
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
    if (this.dataGrid.instance.getSelectedRowsData().length > 0) {
      this.selectedSchedule = this.dataGrid.instance.getSelectedRowsData()[0];
    }
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
    if (this.dataGrid.instance.getSelectedRowsData().length > 0) {
      this.selectedSchedule = this.dataGrid.instance.getSelectedRowsData()[0];
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
  }

  deleteSchedule() {
    if (this.dataGrid.instance.getSelectedRowsData().length > 0) {
      this.selectedSchedule = this.dataGrid.instance.getSelectedRowsData()[0];
      const result = confirm('<i>스케줄을 삭제하시겠습니까?</i>', '스케줄 삭제');
      result.then(dialogResult => {
        if(dialogResult) {
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
      })
    }
  }

  openOnetimeExecution() {
    this.selectedSchedule = undefined;
    if (this.dataGrid.instance.getSelectedRowsData().length > 0) {
      this.selectedSchedule = this.dataGrid.instance.getSelectedRowsData()[0];
      if (this.selectedSchedule.status === 'Running') {
        this.dataGrid.instance.clearSelection();
        this.selectedSchedule = undefined;
      }
    }
    const newId = this.dataGrid.instance.getDataSource().items().length + 1;
    this.editSchedulePopup.openOnetimePopup(this.selectedSchedule, newId);
  }

  onetimeExecution(schedule: any) {
    const selected = this.schedules.find(s => s.flowName === schedule.flowName);
    if (selected !== undefined) {
      schedule = selected;
    }
    this.apollo.mutate<any>({
      mutation: gql`
        mutation onetimeStartFlow($flowSchedule: FlowScheduleInput) {
          onetimeStartFlow(flowSchedule: $flowSchedule) {
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
        flowSchedule : schedule
      }
    }).subscribe(result => {
      this.reloadFlowSchedules();
    });
  }

  refresh = () => {
    this.dataGrid.instance.refresh();
  };

  clearSelection(e) {
    if (e.target.classList.value === '') {
      this.dataGrid.instance.clearSelection();
      this.selectedSchedule = undefined;
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
  declarations: [FlowSchedulerComponent],
})
export class FlowSchedulerModule {
}
