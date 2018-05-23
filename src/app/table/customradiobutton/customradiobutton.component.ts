import {
    Component, Output, Input, EventEmitter, OnInit, OnChanges, SimpleChanges, SimpleChange,
} from '@angular/core';


@Component({
    selector: 'app-custom-radiobutton',
    templateUrl: './customradiobutton.component.html',
    styleUrls: []
})
export class CustomRadioButtonComponent implements OnInit {
    @Input() rowData: any;
    @Output() radioButtonValueChange = new EventEmitter<any>();
    constructor() {

    }

    ngOnInit() {
    }

    onClickingRadio(event) {
        event.target.click();
        this.radioButtonValueChange.emit({ rowData: this.rowData, target: event.target });
    }
}
