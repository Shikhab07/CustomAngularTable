import { Component } from '@angular/core';
import { MaterialSelectComponent } from './table/materialselect/materialselect.component';
import { CustomButtonComponent } from './table/custombutton/custombutton.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
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

  tabcolumns = [];
  perPageSelect: any[] = [1, 2, 3];

  constructor() {
    this.prepareColumnsForTable();
  }

  prepareColumnsForTable() {
    this.tabcolumns = [
      {
        title: 'Domain',
        type: 'text',
        value: 'domain' // column in row data
      },
      {
        title: 'Country',
        type: 'list',
        value: 'country',
        list: this.countries,
        dataTextField: 'title',
        dataValueField: 'value'
      },
      {
        title: 'Currency',
        type: 'text',
        value: 'currency'
      },
      {
        title: 'Payment Provider',
        type: 'text',
        value: 'paymentprovider'
      },
      {
        title: 'Google Analytics Id',
        type: 'text',
        value: 'googleanalyticsId'
      },
      {
        title: 'Google TagId',
        type: 'text',
        value: 'googleTagId'
      },
      {
        title: 'Status',
        type: 'button',
        value: 'status'
      },
      {
        title: 'Language',
        type: 'text',
        value: 'language'
      },
      {
        title: 'Zone',
        type: 'list',
        value: 'zone',
        list: this.zones,
        dataTextField: 'title',
        dataValueField: 'value'
      }
    ];
  }

  onAddEvent(data) {
    // add your code to create new record in db
  }

  onUpdate(data) {
    // add your code to update record in db
  }
}
