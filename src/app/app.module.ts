import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { AppComponent } from './app.component';
import { CustomButtonComponent } from './table/custombutton/custombutton.component';
import { CustomModalDialogComponent } from './table/popup/custommodaldialog.component';
import { MaterialSelectComponent } from './table/materialselect/materialselect.component';
import { CustomTableComponent } from './table/customtable.component';
import { CustomRadioButtonComponent } from './table/customradiobutton/customradiobutton.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomTableComponent,
    CustomButtonComponent,
    CustomModalDialogComponent,
    MaterialSelectComponent,
    CustomRadioButtonComponent
  ],
  imports: [
    BrowserModule,
    Ng2SmartTableModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSelectModule
  ],
  providers: [],
  entryComponents: [CustomButtonComponent,
    CustomModalDialogComponent, MaterialSelectComponent, CustomRadioButtonComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
