import {
    Component, HostListener, OnInit, AfterViewInit, ViewEncapsulation,
    Input, ViewChild, Output, EventEmitter
} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import _ = require('lodash');
// components
import { CustomButtonComponent } from './custombutton/custombutton.component';
import { MaterialSelectComponent } from './materialselect/materialselect.component';
import { CustomRadioButtonComponent } from './customradiobutton/customradiobutton.component';
import { isNullOrUndefined, isNull } from 'util';
import { CustomEditorComponent } from './customeditor/customeditor.component';


@Component({
    selector: 'app-custom-table',
    templateUrl: './customtable.component.html',
    styleUrls: ['./shared/customtable.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CustomTableComponent implements OnInit, AfterViewInit {
    source: LocalDataSource;
    updatedRow: any;
    settings;
    mySettings;
    @Input() data;
    @Input() perPageSelect: any[] = [];
    @Input() showPager: boolean;
    @Input() columns;
    @ViewChild('grdTable') grdTable;
    @Output() addNewRowEvent = new EventEmitter();
    @Output() updateRowEvent = new EventEmitter();
    constructor() {
        this.setInitialTableSettings();
        this.settings = Object.assign({}, this.mySettings);
    }

    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.keyCode === 13) {
            if (!this.ifCreateModeOpen()) {
                const rows = this.grdTable.grid.getSelectedRows();
                if (rows.length > 0) {
                    // only one row can be selected at a time
                    // radio is in first column
                    if (rows[0].cells[0].newValue === true) {
                        if (rows[0].data.id !== 0) {
                            const elt: any = document.getElementsByClassName('ng2-smart-action-edit-save')[rows[0].index];
                            elt.click();
                        }
                    } else {
                        alert('Please select radio button to update.');
                    }
                } else {
                    alert('Please select row to update.');
                }
            }
        }
    }


    ngOnInit() {
        this.source = new LocalDataSource(this.data);
        this.prepareColumns();
    }

    ngAfterViewInit() {
        this.grdTable.grid.dataSet.willSelect = 'false';
    }

    public addColumn(col) {
        if (col.type === 'list') {
            this.mySettings.columns[col.value] = {
                title: col.title,
                filter: false,
                type: 'custom',
                valuePrepareFunction: (cell, row) => {
                    row.list = col.list;
                    row.dataTextField = col.dataTextField;
                    row.dataValueField = col.dataValueField;
                    row.cellValue = cell;
                    return row;
                },
                renderComponent: MaterialSelectComponent,
                onComponentInitFunction: (instance: any) => {
                    instance.eventSelection.subscribe(row => {
                        // Here User can update row in database on dropdown value change

                       this.updateRowEvent.emit(row);
                    });
                },
                editor: {
                    type: 'list',
                    config: {
                        list: col.list
                    }
                }
            };

        } else if (col.type === 'button') {
            this.mySettings.columns[col.value] = {
                title: col.title,
                filter: false,
                type: 'custom',
                renderComponent: CustomButtonComponent,
                onComponentInitFunction: (instance: any) => {
                    instance.statusChange.subscribe(row => {
                        if (row !== '') {
                            // can change below function depending on requirement
                            this.updateStatus(row);
                            this.updateRowEvent.emit(row);
                        }
                    });
                },
                addable: false,
                editable: false
            };
        } else {
            this.mySettings.columns[col.value] = { title: col.title, filter: false };
        }

        this.settings = Object.assign({}, this.mySettings);
    }

    prepareColumns() {
        this.columns.map(col => {
            this.addColumn(col);
        });
    }

    onStatusFilterChange(value) {
        // this.source.addFilter({ field: 'id', search: 'foobar' });
        if (value === '') {
            this.source.setFilter([]);
        } else {
            this.source.setFilter([
                {
                    field: 'status',
                    search: value
                }
            ], true); // false for OR true for AND
        }

        // if from database , set filter on items from database
    }

    setInitialTableSettings() {
        this.mySettings = {
            mode: 'inline',
            // selectMode: 'multi',
            columns: {
                checkbox: {
                    title: '',
                    type: 'custom',
                    filter: false,
                    // defaultValue: true,
                    renderComponent: CustomRadioButtonComponent,
                    onComponentInitFunction: (instance: any) => {
                        instance.radioButtonValueChange.subscribe(row => {
                            this.updatedRow = row.rowData;
                            this.switchToEdit();
                        });
                    },
                    editor: {
                        type: 'custom',
                        component: CustomEditorComponent
                    }
                },
                domain: {
                    title: 'Domain',
                    filter: false
                }
            },
            actions: {
                position: 'left',
                add: true,
                edit: true,
                delete: false
            },
            add: {
                inputClass: '',
                addButtonContent: '',
                createButtonContent: '',
                cancelButtonContent: '',
                confirmCreate: true,
            },
            edit: {
                confirmSave: true
                // saveButtonContent: '<i class="fa fa-check" aria-hidden="true"></i>',
                // cancelButtonContent: '<i class="fa fa-close" aria-hidden="true"></i>'
            },
            pager: {
                display: this.showPager,
                perPageSelect: this.perPageSelect,
                perPage: 3
            },
            attr: {
                class: ''
            }
        };
    }

    getListFromColumns(field) {
        const column = this.columns.find(col => col.value === field);
        if (!isNullOrUndefined(column)) {
            return column.list;
        }
    }
    onCreateConfirm(event) {
        // first check if radio button is selected
        const newRow = this.grdTable.grid.dataSet.newRow;
        if (!isNullOrUndefined(newRow)) {
            if (newRow.cells[0].newValue === true) {
                if (window.confirm('Are you sure you want to create?')) {
                    event.confirm.resolve(event.newData);
                    // validate first then
                    this.createNewRecord(event.newData);
                } else {
                    event.confirm.reject();
                }
            } else {
                alert('Please select radio button to create new record.');
            }
        }
    }

    getTitleFromValue(list: any[], value) {
        const item = list.find(x => x.value === value);
        return (!isNullOrUndefined(item) ? item.title : value);
    }

    addNewRecord(event) {
        this.grdTable.grid.createFormShown = true;
    }

    updateStatus(rowdata) {
        const row = this.data.find(x => x.id === rowdata.id);
        row.status = rowdata.status;
        this.source.refresh();
    }

    createNewRecord(data) {
        // change variables according to your data
        // TO DO service hit
        data.country = this.getTitleFromValue(this.getListFromColumns('country'), data.country);
        data.zone = this.getTitleFromValue(this.getListFromColumns('zone'), data.zone);
        data.status = 'active';

        // emit output event to parent for service hit
         this.addNewRowEvent.emit(data);
    }

    onUpdateConfirm(event) {
        if (window.confirm('Are you sure you want to update?')) {
            event.confirm.resolve(event.newData);
            // change variables according to your data
            event.newData.country = this.getTitleFromValue(this.getListFromColumns('country'), event.newData.country);
            event.newData.zone = this.getTitleFromValue(this.getListFromColumns('zone'), event.newData.zone);
            event.newData.status = 'active';
            // write code to update row in database
            this.updateRowEvent.emit(event.newData);
        } else {
            event.confirm.reject();
        }
    }

    switchToEdit() {
        this.grdTable.grid.getSelectedRows().forEach((row) => {
            this.grdTable.grid.edit(row);
        });
    }

    ifCreateModeOpen() {
        return this.grdTable.grid.createFormShown;
    }
}
