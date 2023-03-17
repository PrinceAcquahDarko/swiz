import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from './app/app.service';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ngtestproject';
  showErrorDays = false;
  showErrorMin = false;
  form: FormGroup;
  days!: number;
  hours!: number;
  mins!: number;

  selectOptions  = this._as.selectOptions

  today = new Date();

  constructor(private _as: AppService, public dialog: MatDialog) {
    let endTime = this.setEndTime().endTime;
    let endDate = this.setEndTime().endDate;
    this.form = new FormGroup({
      startDate: new FormControl(this.today),
      startTime: new FormControl(this.setInitialTime(undefined)),
      endTime: new FormControl(endTime),
      endDate: new FormControl(endDate),
    });

    this.setInitialTimeAndDayDifference();
  }

  setInitialTime(data: string | undefined) {
    let value;
    let hours;
    if (data) {
      hours = data;
    } else {
      hours = this.today.getHours();
    }

    if (hours.toString().length === 1) {
      value = '0' + hours + ':45';
    } else {
      value = hours + ':45';
    }

    return value;
  }

  setEndTime() {
    let endDate = this.today;
    let [hours, minutes] = this.setInitialTime(undefined).split(':');
    endDate.setHours(+hours, +minutes);

    let nexthour = new Date(endDate.getTime() + 60 * 60 * 1000);
    let hr = nexthour.getHours();

    return {
      endDate: nexthour,
      endTime: this.setInitialTime(hr.toString()),
    };
  }

  startTimeChange(event: any) {
    let hmdate = this.startDateAndTimeChange();

    let [realtime, am] = hmdate.toLocaleTimeString().split(' ');
    let min = realtime.split(':')[1];

    this.form.get('endDate')?.patchValue(hmdate);

    let hr = hmdate.getHours();

    let modifiedhour = this.setInitialTime(hr.toString()).split(':')[0];

    this.form.get('endTime')?.patchValue(`${modifiedhour}:${min}`);
  }

  endDateChanged(event: any) {
    this.endDateAndTimeChange();
  }

  endTimeChange(event: any) {
    this.endDateAndTimeChange();
  }

  startDateChanged(event: any) {
    let hmdate = this.startDateAndTimeChange();

    let [realtime, am] = hmdate.toLocaleTimeString().split(' ');
    let min = realtime.split(':')[1];

    this.form.get('endDate')?.patchValue(hmdate);

    let hr = hmdate.getHours();

    let modifiedhour = this.setInitialTime(hr.toString()).split(':')[0];

    this.form.get('endTime')?.patchValue(`${modifiedhour}:${min}`);
  }

  openDialog() {
    let sd = this.form.get('startDate')!.value.toLocaleDateString();
    let st = this.form.get('startTime')!.value;

    let ed = this.form.get('endDate')!.value.toLocaleDateString();
    let et = this.form.get('endTime')!.value;

    let total_startDate = `${sd} ${st}`;
    let tt_endTime = `${ed} ${et}`;

    let start_date = new Date(total_startDate).toISOString();
    let end_date = new Date(tt_endTime).toISOString();
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { start_date, end_date },
    });
  }

  endDateAndTimeChange() {
    this.showErrorDays = false;
    this.showErrorMin = false;
    let sd = this.form.get('startDate')!.value.toLocaleDateString();
    let st = this.form.get('startTime')!.value;

    let ed = this.form.get('endDate')!.value.toLocaleDateString();
    let et = this.form.get('endTime')!.value;

    let total_startDate = `${sd} ${st}`;
    let tt_endTime = `${ed} ${et}`;

    let start_date = new Date(total_startDate);
    let end_date = new Date(tt_endTime);

    let sdmills = start_date.getTime();
    let sd2mils = end_date.getTime();
    if (sdmills > sd2mils) {
      let diff = sdmills - sd2mils;

      let days = Math.floor(diff / (1000 * 60 * 60 * 24));
      let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      if (days) {
        this.showErrorDays = true;
      }

      if (!days && (hours || mins)) {
        this.showErrorMin = true;
      }
      return;
    }

    let diff = sd2mils - sdmills;

    this.days = Math.floor(diff / (1000 * 60 * 60 * 24));
    this.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  }

  startDateAndTimeChange() {
    let sd = this.form.get('startDate')!.value.toLocaleDateString();
    let st = this.form.get('startTime')!.value;

    let ed = this.form.get('endDate')!.value.toLocaleDateString();
    let et = this.form.get('endTime')!.value;

    let total_startDate = `${sd} ${st}`;
    let tt_endTime = `${ed} ${et}`;

    let start_date = new Date(total_startDate);
    let end_date = new Date(tt_endTime);

    const hmdate = new Date(
      start_date.getTime() +
        this.days * 24 * 60 * 60 * 1000 +
        this.hours * 60 * 60 * 1000 +
        +(this.mins * 60 * 1000)
    );

    return hmdate;
  }

  setInitialTimeAndDayDifference() {
    let sd = this.form.get('startDate')!.value.toLocaleDateString();
    let st = this.form.get('startTime')!.value;

    let ed = this.form.get('endDate')!.value.toLocaleDateString();
    let et = this.form.get('endTime')!.value;

    let total_startDate = `${sd} ${st}`;
    let tt_endTime = `${ed} ${et}`;

    let start_date = new Date(total_startDate);
    let end_date = new Date(tt_endTime);

    let sdmills = start_date.getTime();
    let sd2mils = end_date.getTime();

    let diff = sd2mils - sdmills;

    this.days = Math.floor(diff / (1000 * 60 * 60 * 24));
    this.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  }
}
