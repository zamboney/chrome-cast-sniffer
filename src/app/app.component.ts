// tslint:disable:member-ordering
// tslint:disable:no-console
import { AfterViewInit, Component, ViewChild } from '@angular/core';
// tslint:disable-next-line:no-duplicate-imports
import { Pipe, PipeTransform } from '@angular/core';
import { CsvService } from 'angular2-json2csv';
import * as  CDP from 'chrome-remote-interface';
// tslint:disable-next-line:ordered-imports
// tslint:disable-next-line:no-submodule-imports
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-root',
  styles: [],
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit {
  public ngAfterViewInit(): void {
    this.modal.config.ignoreBackdropClick = true;
    this.modal.show();
  }
  public save() {
    const aElement = document.createElement('a');
    // tslint:disable-next-line:max-line-length
    const file = new Blob([JSON.stringify(this.rawRequests.filter((item) => item.url.indexOf(this.filter.url) !== -1), null, '\t')], { type: 'application/json' });
    aElement.href = URL.createObjectURL(file);
    aElement.download = `${this.client.title}_ip_${this.host.replace(/\./g, '-')}_${Date.now()}.json`;
    aElement.click();

  }
  public pulldown = true;
  public isCollapsed = true;
  public host = '';
  public error = '';
  public client = null;
  public requests: Array<{ requestId: string, response?: any, status?: any, raw: any, time: string, url: string }> = [];
  public rawRequests = [];
  @ViewChild('lgModal') public modal: ModalDirective;
  @ViewChild('responseModal') public responseModal: ModalDirective;
  public modalRef: BsModalRef;
  public filter: any = {
    url: '',
  };
  public start() {
    CDP({ host: this.host }, (client) => {
      // extract domains
      const { Network, Page } = client;
      // setup handlers

      Network.requestWillBeSent((params) => {
        this.rawRequests.push(
          params.request,
        );
        this.requests.push({
          raw: params,
          requestId: params.requestId,
          time: new Date().toLocaleTimeString(),
          url: params.request.url,
        });
        if (this.pulldown) {
          window.scrollTo(0, document.body.scrollHeight);
        }
      });
      Network.responseReceived((params) => {
        const index = this.requests.findIndex((req) => req.requestId === params.requestId);
        this.requests[index].response = params.response;
        this.requests[index].status = params.response.status;

      });
      this.modal.hide();
      // enable events then start!
      Promise.all([
        Network.enable(),
      ]).catch((err) => {
        // tslint:disable-next-line:no-console
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
  private response = {};
  public showResponse(request) {
    this.responseModal.show();
    this.response = request.response;
  }
  public setIp(host: string) {
    this.error = '';
    this.host = host;
    CDP.List({ host }).then((client) => {
      this.client = client[0];
    }).catch((error) => {
      this.host = '';
      this.client = null;
      console.log(error);
      this.error = error;
    });

  }
  constructor(private modalService: BsModalService, private csvService: CsvService) {

  }
}
// tslint:disable-next-line:max-classes-per-file
@Pipe({
  name: 'myfilter',
  pure: false,
})
export class MyFilterPipe implements PipeTransform {
  public transform(items: any[], filter: { url: string }): any {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be kept, false will be filtered out
    return items.filter((item) => item.url.indexOf(filter.url) !== -1);
  }
}
// tslint:disable-next-line:max-classes-per-file
@Pipe({
  name: 'prettyprint',
})
export class PrettyPrintPipe {
  public transform(val) {
    return JSON.stringify(val, null, 2)
      .replace(' ', '&nbsp;')
      .replace('\n', '<br/>');
  }
}
