import {
  Component, Input,
  NgModule,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  DxTextBoxModule,
  DxFormModule,
  DxValidatorModule,
  DxSelectBoxModule,
  DxDateBoxModule,
  DxButtonModule,
  DxValidationGroupModule,
  DxPopupModule,
} from 'devextreme-angular';
import {
  FormTextboxModule,
  FormPhotoUploaderModule,
} from 'src/app/components';
import {getSizeQualifier} from 'src/app/services/screen.service';
import {FlowSchedulerComponent} from "../../../../pages/dna/flow-scheduler/flow-scheduler.component";

@Component({
  selector: 'schedule-new-form',
  templateUrl: './schedule-new-form.component.html',
  providers: [],
})

export class ScheduleNewFormComponent {
  @Input() flowSchedulerComponent: FlowSchedulerComponent;

  schedule = {} as any;
  getSizeQualifier = getSizeQualifier;
  popupVisible = false;
  createMode: boolean;

  constructor() {
  }

  save(e) {
    if (this.createMode) {
      this.flowSchedulerComponent.addSchedule(this.schedule);
    } else {
      this.flowSchedulerComponent.updateSchedule(this.schedule);
    }
    this.flowSchedulerComponent.refresh();
    e.preventDefault();
    this.popupVisible = false;
  }

  cancel = () => {
    this.popupVisible = false;
  }

  openPopup(schedule: any) {
    this.schedule = schedule;
    if (schedule === undefined) {
      this.createMode = true;
      this.schedule = {
        id: this.flowSchedulerComponent.schedules.length + 1,
        flow: 'testFlow',
        status: 'Stopped',
        cron: '0 15 10 * * *',
        startTime: '2023-06-26 14:13:25',
        lastExecution: '2023-05-23 14:13:25',
        nextExecution: '2023-08-30 14:13:25',
        executionCount: 1234
      }
    } else {
      this.createMode = false;
    }
    this.popupVisible = true;
  }
}

@NgModule({
  imports: [
    DxTextBoxModule,
    DxFormModule,
    DxValidatorModule,

    FormTextboxModule,
    FormPhotoUploaderModule,

    CommonModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    DxButtonModule,
    DxValidationGroupModule,
    DxPopupModule,
  ],
  declarations: [ScheduleNewFormComponent],
  exports: [ScheduleNewFormComponent],
})
export class ScheduleNewFormModule {
}
