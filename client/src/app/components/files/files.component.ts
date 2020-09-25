import * as fileSaver from 'file-saver';

import { Component, OnInit } from '@angular/core';

import { CurrentContextService } from 'src/app/services/current-context.service';
import { SharedComponent } from '../shared/shared.component';
import { UserFileApiService } from 'src/app/services/user-file.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent extends SharedComponent implements OnInit {


  private _files = [
  ];

  public get files() {
    return this._files;
  }

  constructor(protected currentContextService: CurrentContextService,
              private userFileApiService: UserFileApiService) {
    super(currentContextService);
    this.setupSubscriptions();
  }

  ngOnInit(): void {
    this.getUserFiles();
  }

  private getUserFiles() {
    this.userFileApiService.getUserFiles(this.id, { path: `${this.path}` }).subscribe((fls) => {
      fls.forEach((file) => {
        this._files.push(file);
      });
    });
  }

  public onOpen(fileObj) {

    const updated_array = [];
    this.userFileApiService.getUserFiles(this.id, { path: `${fileObj.path}` }).subscribe((fls) => {
      fls.forEach((file) => {
        updated_array.push(file);
      });
      this._files = updated_array;
    });

  }

  public onDownload(fileObj): void{
    this.userFileApiService.downloadFile(this.id, fileObj.name).subscribe(response => {
        const blob: any = new Blob([response], { type: 'text/json; charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        fileSaver.saveAs(blob, fileObj.original_file_name);
		}), error => {
      console.log(`Error downloading the file ${error}`);
    },
    () => console.info('File downloaded successfully');
  }

}
