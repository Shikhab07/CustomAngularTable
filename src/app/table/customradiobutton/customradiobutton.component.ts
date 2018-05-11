import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';


@Component({
    selector: 'app-custom-radiobutton',
    templateUrl: './customradiobutton.component.html',
    styleUrls: []
})
export class CustomRadioButtonComponent implements OnInit {
    @Input() rowData: any;
    @Output() radioButtonValueChange = new EventEmitter();
    constructor() {

    }

    ngOnInit() {
    }

    onClickingRadio(event) {
        this.radioButtonValueChange.emit(this.rowData);
    }
}
