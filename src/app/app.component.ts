import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import * as  CDP from 'chrome-remote-interface';
import { BsModalService, BsModalRef, ModalDirective } from "ngx-bootstrap/modal";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    this.modal.config.ignoreBackdropClick = true;
    this.modal.show();
  }
  host = '';
  error = '';
  client = null;
  requests: Array<{ time: string, url: string }> = [];
  @ViewChild('lgModal') modal: ModalDirective;
  public modalRef: BsModalRef;
  public filter: any = {
    url: ''
  };
  public start() {
    CDP({ host: this.host }, (client) => {
      // extract domains
      const { Network, Page } = client;
      // setup handlers
      Network.requestWillBeSent((params) => {
        this.requests.push({
          time: new Date().toLocaleTimeString(),
          url: params.request.url
        })
        console.log(params.request.url);
      });
      this.modal.hide();
      // enable events then start!
      Promise.all([
        Network.enable()
      ]).then(() => {

      }).catch((err) => {
        console.error(err);
        client.close();
      });
    }).on('error', (err) => {
      this.host = '';
      this.error = err;
      // cannot connect to the remote endpoint
      console.error(err);
    });
  }
  public setIp(host: string) {
    this.error = '';
    this.host = host;
    CDP.List({ host }).then((client) => {
      this.client = client[0];
    }).catch((error) => {
      this.host = '';
      this.client = null
      console.log(error);
      this.error = error;
    })

  }
  constructor(private modalService: BsModalService) {

  }
}





@Pipe({
  name: 'myfilter',
  pure: false
})
export class MyFilterPipe implements PipeTransform {
  transform(items: any[], filter: { url: string }): any {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be kept, false will be filtered out
    return items.filter(item => item.url.indexOf(filter.url) !== -1);
  }
}
