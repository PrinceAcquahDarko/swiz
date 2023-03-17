import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  start_date:string;
  end_date:string
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {start_date:string,end_date:string}
  ) {
    this.start_date = data.start_date;
    this.end_date = data.end_date
  }

  ngOnInit(): void {}

  close(){
    this.dialogRef.close()
  }
}
