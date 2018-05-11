import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChange,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';

import { isNullOrUndefined } from 'util';
import { DropdownMetaData } from './dropdown';
import { CustomDropdownPipe } from './dropdown.pipe';
import { CustomDropdownTruncatePipe } from './dropdown.truncate.pipe';
import { ViewCell } from 'ng2-smart-table';

@Component({
  providers: [CustomDropdownPipe, CustomDropdownTruncatePipe],
  selector: 'custom-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DropdownComponent implements OnInit {
  initScrollContainer: Function;
  initKeyboardNavigation: Function;
  inputSearchBox: any;
  itemsList: DropdownMetaData[] = [];
  searchItem = '';
  selectedItem = {};
  selectedDropdownItem: DropdownMetaData;
  isBinded = false;


  @Input() rowData: any;
  dataTextField: string;
  dataValueField: number;
  isSearchEnabled: boolean;
  selectedModel?: any;

  @Output() eventSelection: EventEmitter<any> = new EventEmitter();
  @Output() eventTouched: EventEmitter<any> = new EventEmitter();
  @Output() nestedClick: EventEmitter<any> = new EventEmitter();

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    this.selectedDropdownItem = new DropdownMetaData('', 0);
  }

  mapObjectToItemList(data) {
    const ctrl = this;
    this.itemsList = [];
    if (data.length > 0) {
      this.itemsList = data.map(function (element) {
        return new DropdownMetaData(element[ctrl.dataTextField], element[ctrl.dataValueField]);
      });
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
    const list = this.rowData.list;
    const filteredValue = list.find(el => {
      return (el[this.dataValueField] === item.value);
    });
    return filteredValue;
  }

  // Checks if the dropdow item is selected or not
  checkIfSelectionIsEmpty(event) {
    if (event.target.value === '') {
      if (this.inputSearchBox.classList.contains('active')) {
        this.renderer.removeClass(this.inputSearchBox, 'active');
      }
      this.eventTouched.emit(true);
    }
  }

  prepareSelectedModel(selectedItem) {
    const list = this.rowData.list;
    const item = list.find(x => x.title === selectedItem);
    if (item) {
      this.selectedModel = { title: item.title, value: item.value };
      this.mapModelToDropdownItem(this.selectedModel);
    }
  }

  ngOnInit() {
    if (this.rowData) {
      this.dataTextField = this.rowData.dataTextField;
      this.dataValueField = this.rowData.dataValueField;
      this.mapObjectToItemList(this.rowData.list);
      this.prepareSelectedModel(this.rowData.cellValue);
    }
  }

  // ngAfterViewInit() {
  // this.inputSearchBox = this.elementRef.nativeElement.getElementsByClassName('searchBox')[0];
  // this.initKeyboardNavigation =
  //   this.renderer.listen(this.elementRef.nativeElement.getElementsByClassName('searchBox')[0], 'keydown', (evt) => {
  //     let firstChild, child;

  //     if (evt.which === 40 || evt.which === 9) {
  //       firstChild = this.elementRef.nativeElement.getElementsByClassName('no_border')[0].firstElementChild;
  //       firstChild.focus();
  //       this.eventTouched.emit(false);
  //     } else if (evt.which === 32) {
  //       child = this.elementRef.nativeElement.getElementsByClassName('dropdown')[0];
  //       this.renderer.addClass(child, 'open');
  //       firstChild = this.elementRef.nativeElement.getElementsByClassName('no_border')[0].firstElementChild;
  //       firstChild.focus();
  //       this.eventTouched.emit(false);
  //     } else if (evt.which === 16 || evt.which === 17 || evt.which === 18) {
  //       // do nothing
  //       return true;
  //     }
  //   });
  //  }

  // ngOnDestroy() {
  // removes listener
  // this.initKeyboardNavigation();
  // }

  onDropdownItemSelection(selection: any, event) {
    let filtered;
    this.searchItem = '';
    event.target.parentNode.blur();
    this.selectedDropdownItem = selection;
    filtered = this.mapDropDownItemToModel(this.selectedDropdownItem);
    this.elementRef.nativeElement.getElementsByClassName('searchBox')[0].value = this.selectedDropdownItem.label;
    this.eventSelection.emit(filtered);
    this.eventTouched.emit(false);
    this.nestedClick.emit('close');
  }

  onInputBlur(event) {
    // this.renderer.removeClass(event.target.nextElementSibling, 'fa-search');
    // this.renderer.addClass(event.target.nextElementSibling, 'fa-chevron-down');
    // this.checkIfSelectionIsEmpty(event);
  }

  onIconClick(event) {
    event.target.previousElementSibling.focus();
    this.nestedClick.emit('open');
  }

  onInputFocus(event) {
    this.renderer.removeClass(event.target.nextElementSibling, 'fa-chevron-down');
    this.renderer.addClass(event.target.nextElementSibling, 'fa-search');
    this.nestedClick.emit('open');
  }

  onKeyDown(event, item) {
    event.stopPropagation();
    switch (event.which) {
      case 38:
        // arrow up
        isNullOrUndefined(event.target.previousElementSibling) ? event.preventDefault() :
          event.target.previousElementSibling.focus();
        break;
      case 40:
        // arrow down
        isNullOrUndefined(event.target.nextElementSibling) ? event.preventDefault() : event.target.nextElementSibling.focus();
        this.eventTouched.emit(false);
        break;
      case 9:
        // Tab
        if (isNullOrUndefined(event.target.nextElementSibling)) {
          event.preventDefault();
        } else {
          event.target.nextElementSibling.focus();
        }
        break;
      case 13:
        // enter key
        this.onDropdownItemSelection(item, event);
        this.renderer.removeClass(this.elementRef.nativeElement.getElementsByClassName('dropdown')[0], 'open');
        break;
    }
    event.preventDefault();
  }

  toggleDropdown(event, inputText) {
    if (inputText.trim().length > 0) {
      this.renderer.addClass(this.elementRef.nativeElement.getElementsByClassName('dropdown')[0], 'open');
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement.getElementsByClassName('dropdown')[0], 'open');
    }
    this.nestedClick.emit('open');
  }

  setComponentFocus(event, isActive: boolean) {
    if (event.which === 9) {
      if (isActive) {
        this.renderer.addClass(this.inputSearchBox, 'active');
      } else {
        this.renderer.removeClass(this.inputSearchBox, 'active');
      }
    }
  }

  // ngDoCheck() {
  // if (!this.isBinded && this.elementRef.nativeElement.getElementsByClassName('mCSB_scrollTools_vertical').length > 0 &&
  //   this.elementRef.nativeElement.getElementsByClassName('mCSB_scrollTools_vertical')[0] !== 'undefined') {
  //   this.isBinded = true;
  //   this.renderer.listen(this.elementRef.nativeElement.getElementsByClassName('mCSB_scrollTools_vertical')[0], 'click', (e) => {
  //     e.stopPropagation();
  //   });
  // }
  // }
}

