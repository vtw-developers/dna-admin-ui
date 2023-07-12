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
import {exportDataGrid as exportDataGridToPdf} from 'devextreme/pdf_exporter';
import {exportDataGrid as exportDataGridToXLSX} from 'devextreme/excel_exporter';
import {
  CardActivitiesModule,
  ContactStatusModule,
} from 'src/app/components';
import {Contact, ContactStatus,} from 'src/app/types/contact';
import {SelectionChangedEvent} from 'devextreme/ui/drop_down_button';
import DataSource from 'devextreme/data/data_source';
import {CommonModule} from '@angular/common';
import {DataService} from 'src/app/services';
import {Workbook} from 'exceljs';
import {saveAs} from 'file-saver-es';
import {jsPDF} from 'jspdf';
import {FormPopupModule} from 'src/app/components';
import {ContactPanelModule} from 'src/app/components/library/contact-panel/contact-panel.component';
import {Observable, of} from 'rxjs';
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

  filterStatusList = ['All', 'Running', 'Stopped', 'Error'];
  isPanelOpened = false;
  flowName;
  schedule;
  selectedSchedule;
  schedules = [
    {
      id: '1',
      flowName: 'Flow1',
      status: 'Running',
      cronExpression: '0 0/5 * * * ?',
      nextFireTime: '2023-05-23 14:13:25',
      prevFireTime: '2023-05-23 14:13:25',
      startTime: '2023-05-23 14:13:25'
    },
    {
      id: '2',
      flowName: 'Flow2',
      status: 'Error',
      cronExpression: '0 0 12 * * *',
      nextFireTime: '2023-05-23 14:13:25',
      prevFireTime: '2023-05-23 14:13:25',
      startTime: '2023-05-23 14:13:25'
    },
    {
      id: '3',
      flowName: 'Flow3',
      status: 'Stopped',
      cronExpression: '0 0 12 * * *',
      nextFireTime: '2023-05-23 14:13:25',
      prevFireTime: '2023-05-23 14:13:25',
      startTime: '2023-05-23 14:13:25'
    }
  ]

  dataSource = new DataSource<Contact[], string>({
    key: 'id',
    load: () => new Promise((resolve, reject) => {
      of(this.schedules).subscribe({
        next: (data: any[]) => resolve(data),
        error: ({message}) => reject(message)
      })
    }),
    // load: () => new Promise((resolve, reject) => {
    //     this.service.getContacts().subscribe({
    //         next: (data: Contact[]) => {
    //             console.log(data);
    //             resolve(data)
    //         },
    //         error: ({message}) => reject(message)
    //     })
    // }),
  });

  constructor(private service: DataService, private apollo: Apollo) {
  }

  openAddSchedule() {
    const checkedRow = this.dataGrid.instance.getSelectedRowKeys()
    if(this.selectedSchedule === undefined && checkedRow.length > 0) {
      this.selectedSchedule = this.schedules.find(item => item.id === checkedRow[checkedRow.length - 1]);
    }
    this.editSchedulePopup.openPopup(this.selectedSchedule);
  };

  addSchedule(flowSchedule: any) {
    // this.schedules.push(schedule);
    console.log(flowSchedule)

    this.apollo.mutate<any>({
      mutation: gql`
        mutation createSchedule($flowSchedule: FlowScheduleInput) {
          createSchedule(flowSchedule: $flowSchedule) {
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
      console.log(result)

    });

  }

  updateSchedule(schedule: any) {
    const oldOneIndex = this.schedules.findIndex(item => item.id === schedule.id);
    this.schedules.splice(oldOneIndex, 1);
    this.schedules.push(schedule);
  }

  startSchedule() {
    const oldOneIndex = this.schedules.findIndex(item => item.id === this.selectedSchedule.id);
    this.schedules.splice(oldOneIndex, 1);
    this.selectedSchedule.status = 'Running';
    this.schedules.push(this.selectedSchedule);
  }

  stopSchedule() {
    const oldOneIndex = this.schedules.findIndex(item => item.id === this.selectedSchedule.id);
    this.schedules.splice(oldOneIndex, 1);
    this.selectedSchedule.status = 'Stopped';
    this.schedules.push(this.selectedSchedule);
  }

  deleteSchedule() {
    const checkedRows = this.dataGrid.instance.getSelectedRowKeys();
    if(checkedRows.length > 0) {
      const selectedSchedules = [];

      for(let i=0; i<checkedRows.length; i++) {
        console.log(checkedRows[i])
        this.schedules.splice(checkedRows[i], 1);
        console.log(this.schedules)

        // ===============================================
        let item = this.schedules[checkedRows[i] - 1];
        selectedSchedules[i] = item;
        // selectedSchedules => backend 연결 시 사용
      }
      console.log(selectedSchedules)
    } else {
      const oldOneIndex = this.schedules.findIndex(item => item.id === this.selectedSchedule.id);
      this.schedules.splice(oldOneIndex, 1);
    }
    this.refresh();
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

  onExporting(e) {
    if (e.format === 'pdf') {
      const doc = new jsPDF();
      exportDataGridToPdf({
        jsPDFDocument: doc,
        component: e.component,
      }).then(() => {
        doc.save('Contacts.pdf');
      });
    } else {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Contacts');

      exportDataGridToXLSX({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], {type: 'application/octet-stream'}), 'Contacts.xlsx');
        });
      });
      e.cancel = true;
    }
  }
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
