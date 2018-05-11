import { Component, HostListener, OnInit, AfterViewInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { DomSanitizer } from '@angular/platform-browser';
import _ = require('lodash');
// components
import { CustomButtonComponent } from './custombutton/custombutton.component';
import { MaterialSelectComponent } from './materialselect/materialselect.component';
import { CustomRadioButtonComponent } from './customradiobutton/customradiobutton.component';
import { isNullOrUndefined } from 'util';

@Component({
    selector: 'app-custom-table',
    templateUrl: './customtable.component.html',
    styleUrls: []
})
export class CustomTableComponent implements AfterViewInit {
    title = 'app';
    source: LocalDataSource;
    currentPerPage: any;
    perPageSelect: any[] = [1, 2, 3];

    updatedRow: any;

    constructor(private _sanitizer: DomSanitizer) {
        this.source = new LocalDataSource(this.data);
    }

    countries = [
        {
            value: '1',
            title: 'Norway'
        },
        {
            value: '2',
            title: 'Sweden'
        },
        {
            value: '3',
            title: 'UnitedStates'
        },
        {
            value: '4',
            title: 'Denmark'
        },
        {
            value: '5',
            title: 'Australia'
        }
    ];
    zones = [
        {
            value: '4',
            title: 'No-Nordic'
        },
        {
            value: '2',
            title: 'NA-NorthAmerica'
        }
    ];
    settings = {
        mode: 'inline',
        columns: {
            checkbox: {
                title: '',
                type: 'custom',
                filter: false,
                renderComponent: CustomRadioButtonComponent,
                onComponentInitFunction: (instance: any) => {
                    instance.radioButtonValueChange.subscribe(row => {
                        this.updatedRow = row;
                    });
                },
                editor: {
                    type: 'checkbox',
                    // config: {
                    //     true: 'Yes',
                    //     false: 'No',
                    // }
                }
            },
            domain: {
                title: 'Domain',
                filter: false
            },
            country: {
                title: 'Country',
                filter: false,
                type: 'custom',
                valuePrepareFunction: (cell, row) => {
                    row.list = this.countries;
                    row.dataTextField = 'title';
                    row.dataValueField = 'value';
                    row.isSearchEnabled = false;
                    row.cellValue = cell;
                    return row;
                },
                renderComponent: MaterialSelectComponent,
                onComponentInitFunction: (instance: any) => {
                    instance.eventSelection.subscribe(row => {
                        console.log(row);
                    });
                },
                editor: {
                    type: 'list',
                    config: {
                        list: this.countries,
                    }
                }
            },
            currency: {
                title: 'Currency',
                filter: false
            },
            paymentprovider: {
                title: 'Payment Provider',
                filter: false
            },
            googleanalyticsId: {
                title: 'Google Analytics Id',
                filter: false
            },
            googleTagId: {
                title: 'Google TagId',
                filter: false
            },
            language: {
                title: 'Language',
                filter: false
            },
            status: {
                title: 'Status',
                filter: false,
                type: 'custom',
                renderComponent: CustomButtonComponent,
                onComponentInitFunction: (instance: any) => {
                    instance.statusChange.subscribe(row => {
                        if (row !== '') {
                            this.updateStatus(row);
                        }
                    });
                },
                addable: false
            },
            zone: {
                title: 'Zone',
                filter: false,
                type: 'custom',
                valuePrepareFunction: (cell, row) => {
                    row.list = this.zones;
                    row.dataTextField = 'title';
                    row.dataValueField = 'value';
                    row.isSearchEnabled = false;
                    row.cellValue = cell;
                    return row;
                },
                renderComponent: MaterialSelectComponent,
                onComponentInitFunction: (instance: any) => {
                    instance.eventSelection.subscribe(row => {
                        console.log(row);
                    });
                },
                editor: {
                    type: 'list',
                    config: {
                        list: this.zones,
                    }
                },
            }
        },
        actions: {
            position: 'right',
            add: true,
            edit: false,
            delete: false
        },
        add: {
            inputClass: '',
            addButtonContent: '',
            createButtonContent: '',
            cancelButtonContent: '',
            confirmCreate: true,
        },
        pager: {
            display: true,
            perPageSelect: this.perPageSelect
        }
    };

    data = [
        {
            id: '1',
            domain: 'proteinfabrikken.no',
            country: 'Norway',
            currency: 'NOK-kr',
            paymentprovider: 'Manage',
            googleTagId: 'UA-48839936-1',
            googleanalyticsId: 'UA-48839936-1',
            socialNetworks: 'Manage',
            language: 'Norwegian',
            zone: 'No-Nordic',
            status: 'active'
        },
        {
            id: '2',
            domain: 'proteinfabrikken.se',
            country: 'Sweden',
            currency: 'SEK-kr',
            paymentprovider: 'Manage',
            googleTagId: 'UA-48839937-1',
            googleanalyticsId: 'UA-48839937-1',
            socialNetworks: 'Manage',
            language: 'Swedish',
            zone: 'No-Nordic',
            status: 'active'
        },
        {
            id: '3',
            domain: 'proteinfabrikken.com',
            country: 'UnitedStates',
            currency: 'DKK-Kr',
            paymentprovider: 'Manage',
            googleTagId: 'UA-48839939-1',
            googleanalyticsId: 'UA-48839939-1',
            socialNetworks: 'Manage',
            language: 'English',
            zone: 'NA-NorthAmerica',
            status: 'inactive'
        }
    ];



    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.keyCode === 13) {
            if (!isNullOrUndefined(this.updatedRow)) {
                if (this.updatedRow.id !== 0) {
                    // write code to update row in database
                }
            } else {
                const elt: any = document.getElementsByClassName('ng2-smart-action-add-create')[0];
                elt.click();
            }
        }
    }

    ngAfterViewInit() {
        const actionColumn: any = document.getElementsByClassName('ng2-smart-actions')[0];
        actionColumn.style.display = 'none';
    }

    updateStatus(rowdata) {
        const row = this.data.find(x => x.id === rowdata.id);
        row.status = rowdata.status;
        this.source.refresh();
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

    onCreateConfirm(event) {
        if (window.confirm('Are you sure you want to create?')) {
            // event.newData['name'] += ' + added in code';

            event.confirm.resolve(event.newData);

            // save to db
            // TO DO function to call service function to add new record to db
            console.log(event.newData);
            this.createNewRecord(event.newData);
        } else {
            event.confirm.reject();
        }
    }

    createNewRecord(data) {
        // TO DO service hit
        data.country = this.getTitleFromValue(this.countries, data.country);
        data.zone = this.getTitleFromValue(this.zones, data.zone);
        data.status = 'active';
    }

    getTitleFromValue(list: any[], value) {
        return list.find(x => x.value === value).title;
    }

    addNewRecord(event) {
        const addbtn: any = document.getElementsByClassName('ng2-smart-action-add-add')[0];
        addbtn.click();
    }
}
