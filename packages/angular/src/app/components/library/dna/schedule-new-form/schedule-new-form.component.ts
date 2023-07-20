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
  onetimeMode: boolean;
  flowNames = [];
  existSchedule =[];

  constructor() {
  }

  save(e) {
    if(this.onetimeMode) {
      this.flowSchedulerComponent.onetimeExecution(this.schedule);
    } else {
      if (this.createMode) {
        this.schedule.startTime = this.formatDate(this.schedule.startTime);
        this.flowSchedulerComponent.addSchedule(this.schedule);
      } else {
        const before = this.flowSchedulerComponent.schedules.find(s => s.flowName === this.schedule.flowName);
        if (before.cronExpression === null) {
          this.schedule.startTime = this.formatDate(this.schedule.startTime);
        }
        this.flowSchedulerComponent.updateSchedule(this.schedule);
      }
    }
    e.preventDefault();
    this.popupVisible = false;
  }

  cancel = () => {
    this.popupVisible = false;
  }

  openPopup(schedule: any, newId: number) {
    this.flowNames = ['testFlow', 'testFlow2', 'testFlow3'];
    this.existSchedule = [];
    this.flowSchedulerComponent.schedules.forEach(s => this.existSchedule.push(s.flowName));

    this.onetimeMode = false;
    this.schedule = schedule;
    if (schedule === undefined) {
      for (let i=0; i<this.existSchedule.length; i++) {
        const findIndex = this.flowNames.findIndex(s => s === this.existSchedule[i]);
        this.flowNames.splice(findIndex, 1);
      }
      this.createMode = true;
      this.schedule = {
        id: newId.toString(),
        flowName: this.flowNames[0],
        status: 'Not Started',
        cronExpression: '0/10 * * * * ?',
        nextFireTime: '',
        prevFireTime: '',
        startTime: new Date(),
      }
    } else {
      this.createMode = false;
    }
    this.popupVisible = true;
  }

  openOnetimePopup(schedule: any, newId: number) {
    this.flowNames = ['testFlow', 'testFlow2', 'testFlow3'];
    this.onetimeMode = true;
    this.flowSchedulerComponent.schedules.forEach(s => {
      if (s.status === 'Running') {
        const index = this.flowNames.findIndex(f => f === s.flowName);
        this.flowNames.splice(index, 1);
      }
    });
    if (schedule === undefined) {
      this.schedule = {
        id: newId.toString(),
        flowName: this.flowNames[0]
      }
    } else {
      this.schedule = {
        id: schedule.id,
        flowName: schedule.flowName
      }
    }
    this.popupVisible = true;
  }

  formatDate(startTime) {
    const date = startTime.toISOString().split('T')[0];
    const time = startTime.toTimeString().split(' ')[0];
    return date + ' ' + time;
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
