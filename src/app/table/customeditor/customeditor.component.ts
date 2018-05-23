import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';


@Component({
    selector: 'app-custom-editor',
    templateUrl: './customeditor.component.html',
    styleUrls: []
})
export class CustomEditorComponent extends DefaultEditor implements AfterViewInit {

    constructor() {
        super();
    }

    ngAfterViewInit() {
    }
    
    onKeyEnter(event) {
        this.onEdited.emit(event);
    }

    onKeyEscToCancel(event) {
        this.onStopEditing.emit(event);
    }

    onClickRadio(event) {
        this.cell.newValue = event.target.checked;
    }

}
