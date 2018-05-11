import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import _ = require('lodash');

@Component({
    selector: 'app-custom-material-select',
    templateUrl: './materialselect.component.html',
    styleUrls: []
})
export class MaterialSelectComponent implements OnInit {

    clonedData: any;
    listData: any[] = [];
    dataTextField: string;
    dataValueField: number;
    selectedModel?: any;
    selectedDropdownItem: DropdownMetaData;
    @Input() rowData: any;
    @Output() eventSelection: EventEmitter<any> = new EventEmitter();

    constructor() {
        this.selectedDropdownItem = new DropdownMetaData('', 0);
    }

    ngOnInit() {
        if (this.rowData) {
            this.clonedData = _.clone(this.rowData);

            this.dataTextField = this.clonedData.dataTextField;
            this.dataValueField = this.clonedData.dataValueField;
            this.mapObjectToItemList(this.clonedData.list);
            this.prepareSelectedModel(this.clonedData.cellValue);
        }
    }
    mapObjectToItemList(data) {
        const ctrl = this;
        this.listData = [];
        if (data.length > 0) {
            this.listData = data.map(function (element) {
                return new DropdownMetaData(element[ctrl.dataTextField], element[ctrl.dataValueField]);
            });
        }
    }
    prepareSelectedModel(selectedItem) {
        const list = this.clonedData.list;
        const item = list.find(x => x.title === selectedItem);
        if (item) {
            this.selectedModel = { title: item.title, value: item.value };
            this.mapModelToDropdownItem(this.selectedModel);
        }
    }

    mapModelToDropdownItem(model) {
        if (Object.keys(model).length !== 0) {
            this.selectedDropdownItem = new DropdownMetaData(model[this.dataTextField], model[this.dataValueField]);
        } else {
            this.selectedDropdownItem = new DropdownMetaData('', 0);
        }
    }

    mapDropDownItemToModel(item) {
        const list = this.clonedData.list;
        const filteredValue = list.find(el => {
            return (el[this.dataValueField] === item.value);
        });
        return filteredValue;
    }

    onDropdownItemSelection(selection: any, event) {
        let filtered;
        this.selectedDropdownItem = selection;
        filtered = this.mapDropDownItemToModel(this.selectedDropdownItem);
        this.eventSelection.emit(filtered);
    }
}

export class DropdownMetaData {
    label: any;
    value: number;

    constructor(label: string, value: number) {
        this.label = label;
        this.value = value;
    }
}

