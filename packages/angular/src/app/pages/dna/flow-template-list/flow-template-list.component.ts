import {
  Component, ViewChild, NgModule,
} from '@angular/core';
import {
  DxButtonModule,
  DxDataGridModule,
  DxDataGridComponent,
  DxDropDownButtonModule,
  DxSelectBoxModule,
  DxTextBoxModule, DxTreeViewModule,
} from 'devextreme-angular';
import {RowClickEvent} from 'devextreme/ui/data_grid';
import {exportDataGrid as exportDataGridToPdf} from 'devextreme/pdf_exporter';
import {exportDataGrid as exportDataGridToXLSX} from 'devextreme/excel_exporter';
import {
  CardActivitiesModule,
  ContactStatusModule,
} from 'src/app/components';
import {Contact, contactStatusList, ContactStatus,} from 'src/app/types/contact';
import {SelectionChangedEvent} from 'devextreme/ui/drop_down_button';
import DataSource from 'devextreme/data/data_source';
import {CommonModule} from '@angular/common';
import {DataService} from 'src/app/services';
import {Workbook} from 'exceljs';
import {saveAs} from 'file-saver-es';
import {jsPDF} from 'jspdf';
import {formatPhone} from 'src/app/pipes/phone.pipe';
import {FormPopupModule} from 'src/app/components';
import {ContactPanelModule} from 'src/app/components/library/contact-panel/contact-panel.component';
import {ContactNewFormModule} from 'src/app/components/library/contact-new-form/contact-new-form.component';
import {Observable, of} from 'rxjs';
import {ExtractNewFormModule} from '../../../components/library/dna/extract-new-form/extract-new-form.component';
import {
  FlowTemplateNewFormModule
} from '../../../components/library/dna/template-new-form/template-new-form.component';

type FilterContactStatus = ContactStatus | 'All';

@Component({
  selector: 'flow-template-list',
  templateUrl: './flow-template-list.component.html',
  styleUrls: ['./flow-template-list.component.scss'],
  providers: [DataService],
})
export class FlowTemplateListComponent {
  @ViewChild(DxDataGridComponent, {static: true}) dataGrid: DxDataGridComponent;

  statusList = contactStatusList;

  filterStatusList = ['전체', '대한상공회의소'];

  isPanelOpened = false;

  isAddContactPopupOpened = false;

  userId: number;

  programs = [
    {
      id: 1,
      name: '변동 테이블 추출'
    },
    {
      id: 2,
      name: '원천 테이블 추출'
    },
    {
      id: 3,
      name: 'CDC 추출'
    },
    {
      id: 4,
      name: 'Simple Rest'
    },
  ]

  dataSource = new DataSource<Contact[], string>({
    key: 'id',
    load: () => new Promise((resolve, reject) => {
      of(this.programs).subscribe({
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

  constructor(private service: DataService) {
  }

  addTemplate() {
    this.isAddContactPopupOpened = true;
  };

  refresh = () => {
    this.dataGrid.instance.refresh();
  };

  rowClick(e: RowClickEvent) {
    const {data} = e;

    this.userId = data.id;
    this.isPanelOpened = true;
  }

  onOpenedChange = (value: boolean) => {
    if (!value) {
      this.userId = null;
    }
  };

  onPinnedChange = () => {
    this.dataGrid.instance.updateDimensions();
  };

  filterBySystem = (e: SelectionChangedEvent) => {
    const {item: system}: { item: FilterContactStatus } = e;

    if (system === '전체') {
      this.dataGrid.instance.clearFilter();
    } else {
      this.dataGrid.instance.filter(['system', '=', system]);
    }
  };

  filterByStatus = (e: SelectionChangedEvent) => {
    const {item: status}: { item: FilterContactStatus } = e;

    if (status === 'All') {
      this.dataGrid.instance.clearFilter();
    } else {
      this.dataGrid.instance.filter(['status', '=', status]);
    }
  };

  customizePhoneCell = ({value}) => value ? formatPhone(value) : undefined;

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
    FlowTemplateNewFormModule,
    FormPopupModule,
    CardActivitiesModule,
    ContactStatusModule,

    CommonModule,
    DxTreeViewModule,
  ],
  providers: [],
  exports: [
    FlowTemplateListComponent
  ],
  declarations: [FlowTemplateListComponent],
})
export class FlowTemplateListModule {
}
