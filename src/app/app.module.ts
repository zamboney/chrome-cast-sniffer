import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AppComponent, MyFilterPipe, PrettyPrintPipe } from './app.component';
import { FormsModule } from '@angular/forms';
import { CsvService } from "angular2-json2csv";
import {PrettyJsonModule} from 'angular2-prettyjson';
import { Logger } from "angular2-logger/core";

@NgModule({
  declarations: [
    AppComponent,
    PrettyPrintPipe,
    MyFilterPipe,
  ],
  imports: [
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
    BrowserModule,
    FormsModule,
    PrettyJsonModule,
  ],

  providers: [CsvService, Logger],
  bootstrap: [AppComponent]
})
export class AppModule { }
