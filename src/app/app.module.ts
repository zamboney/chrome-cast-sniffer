import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AppComponent, MyFilterPipe } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    MyFilterPipe
  ],
  imports: [
    ModalModule.forRoot(),
    BrowserModule
  ],
  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
