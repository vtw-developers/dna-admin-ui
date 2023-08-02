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
  DxPopupModule, DxRadioGroupModule,
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
  cronInputTypes = ['Text', 'Select'];
  isCronSelect = false;
  cronSelect = {} as any;

  seconds = Array.from(Array(60).keys()).toString().split(',');
  minutes = Array.from(Array(60).keys()).toString().split(',');
  hours = Array.from(Array(24).keys()).toString().split(',');
  day = Array.from(Array(32).keys()).toString().split(',');
  month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', '*'];

  constructor() {
    this.seconds.push('*');
    this.minutes.push('*');
    this.hours.push('*');
    this.day.push('*');
  }

  save(e) {
    if(this.onetimeMode) {
      this.flowSchedulerComponent.onetimeExecution(this.schedule);
    } else {
      if (this.createMode) {
        this.schedule.startTime = this.formatDate(this.schedule.startTime);
        this.flowSchedulerComponent.addSchedule(this.schedule);
      } else {
        this.schedule.startTime = this.formatDate(this.schedule.startTime);
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
    this.flowNames = ['testFlow1', 'testFlow2', 'testFlow3'];
    const exist = this.flowSchedulerComponent.schedules.filter(s => s.cronExpression !== null);
    for (let i=0; i<exist.length; i++) {
      const findIndex = this.flowNames.findIndex(s => s === exist[i]?.flowName);
      this.flowNames.splice(findIndex, 1);
    }
    this.onetimeMode = false;
    if (schedule === undefined) {
      this.createMode = true;
    } else {
      this.createMode = false;
      this.flowNames = [schedule.flowName];
    }
    this.schedule = {
      id: this.createMode? newId.toString() : schedule.id,
      flowName: this.flowNames[0],
      cronExpression: this.createMode? '0/10 * * * * ? *' : schedule.cronExpression,
      startTime: new Date()
    }
    this.cronSelect = {};
    if (!this.createMode) {
      const cronExSplit = schedule.cronExpression.replace('0/','').split(' ');
      this.cronSelect.seconds = cronExSplit[0];
      this.cronSelect.minutes = cronExSplit[1];
      this.cronSelect.hours = cronExSplit[2];
      this.cronSelect.day = cronExSplit[3];
      this.cronSelect.month = cronExSplit[4];
    }
    this.popupVisible = true;
  }

  openOnetimePopup(schedule: any) {
    this.flowNames = ['testFlow1', 'testFlow2', 'testFlow3'];
    this.onetimeMode = true;
    this.schedule = {
      flowName: schedule === undefined? this.flowNames[0] : schedule.flowName
    }
    this.popupVisible = true;
  }

  formatDate(startTime) {
    const date = startTime.toISOString().split('T')[0];
    const time = startTime.toTimeString().split(' ')[0];
    return date + ' ' + time;
  }

  cronInputTypeChanged(type) {
    if (type === 'Select') {
      this.isCronSelect = true;
    } else {
      this.isCronSelect = false;
    }
  }

  cronSelectChanged() {
    let seconds = this.cronSelect.seconds;
    let minutes = this.cronSelect.minutes;
    let hours = this.cronSelect.hours;
    let day = this.cronSelect.day;
    let month = this.cronSelect.month;

    if (seconds === undefined) {
      seconds = '*';
    }
    if (minutes === undefined) {
      minutes = '*';
    }
    if (hours === undefined) {
      hours = '*';
    }
    if (day === undefined) {
      day = '*';
    }
    if (month === undefined) {
      month = '*';
    }
    if (seconds !== '0' && seconds !== '*' && minutes === '*') {
      seconds = '0/' + this.cronSelect.seconds;
    }
    if (minutes !== '0' && minutes !== '*' && hours === '*') {
      minutes = '0/' + this.cronSelect.minutes;
    }
    const cronEx = seconds+' '+minutes+' '+hours+' '+day+' '+month+' '+'?'+' '+'*';
    this.schedule.cronExpression = cronEx;
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
    DxRadioGroupModule,
  ],
  declarations: [ScheduleNewFormComponent],
  exports: [ScheduleNewFormComponent],
})
export class ScheduleNewFormModule {
}
