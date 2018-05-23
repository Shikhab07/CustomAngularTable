import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CustomModalDialogComponent } from '../popup/custommodaldialog.component';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'app-custom-button',
    templateUrl: './custombutton.component.html',
    styleUrls: []
})
export class CustomButtonComponent implements OnInit {
    renderValue: string;
    dialogRef: any;
    @Input() value: string | number;
    @Input() rowData: any;
    @Output() statusChange: EventEmitter<string> = new EventEmitter<string>();
    constructor(public dialog: MatDialog) { }

    ngOnInit() {
       this.renderValue = this.value.toString();
    }
    openDialog(): void {
        const dialogRef = this.dialog.open(CustomModalDialogComponent, {
            width: '250px',
            data: { name: 'Sample' }
        });

        dialogRef.afterClosed().subscribe(result => {
            // result has the value returned on closing dialog
            this.rowData.status = 'inactive';
            this.statusChange.emit(this.rowData);
        });
    }
}
