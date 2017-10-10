import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AppComponent, MyFilterPipe } from './app.component';
import { FormsModule } from '@angular/forms';
import { CsvService } from "angular2-json2csv";

@NgModule({
  declarations: [
    AppComponent,
    MyFilterPipe
  ],
  imports: [
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
    BrowserModule,
    FormsModule
  ],

  providers: [CsvService],
  bootstrap: [AppComponent]
})
export class AppModule { }
