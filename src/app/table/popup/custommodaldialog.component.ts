import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-modaldialog',
  templateUrl: './custommodaldialog.component.html',
  styleUrls: []
})
export class CustomModalDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CustomModalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onCancelClick(): void {
    this.dialogRef.close('Sample App');
  }

}
