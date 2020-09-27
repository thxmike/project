import * as fileSaver from 'file-saver';

import { Component, OnInit } from '@angular/core';

import { CurrentContextService } from 'src/app/services/current-context.service';
import { FileRefreshService } from 'src/app/services/file-refresh.service';
import { MatDialog } from '@angular/material/dialog';
import { ShareDialogComponent } from '../share-dialog/share-dialog.component';
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
              protected dialog: MatDialog,
              private userFileApiService: UserFileApiService,
              protected fileRefreshService: FileRefreshService
              ) {
    super(currentContextService, dialog, fileRefreshService);
    this.setupSubscriptions();
  }

  ngOnInit(): void {
    this.getUserFiles(this.path);
  }

  protected setupSubscriptions(): void{
    super.setupSubscriptions();
    this.fileRefreshService.trigger.subscribe(() => {
      this.getUserFiles(this.path);
    });
  }

  public getUserFiles(fileOrFolder: any): void {
    this.userFileApiService.getUserFiles(this.userId, { path: `${fileOrFolder}` }).subscribe((fls) => {
      const tmp = [];
      fls.forEach((file) => {
        tmp.push(file);
      });
      this._files = tmp;
      this._path = fileOrFolder;
    });
  }

  public getUserFilesIShare(): void {
    this.userFileApiService.getUserFiles(this.userId, {  $where: 'this.name.length > 1' }).subscribe((fls) => {
      const tmp = [];
      fls.forEach((file) => {
        tmp.push(file);
      });
      this._files = tmp;
    });
  }

  public onDelete(file): void {
      this.userFileApiService.deleteFileOrFolder(this.userId, file).subscribe(
        () => {
          console.log(file.type === 'folder' ? `Folder ${file.path} Deleted` : `File ${file.name} Deleted`);
          this.getUserFiles(this.path);
        }
      );
  }

  public onShare(file): void {
    this.onOpenBasicDialog<ShareDialogComponent>(
      ShareDialogComponent,
      { width: '35%', height: '30%', panelClass: 'custom-dialog-container'}, { userId: this.userId, file});
  }

  public onDownload(fileObj): void{
    this.userFileApiService.downloadFile(this.userId, fileObj.name).subscribe(response => {
        const blob: any = new Blob([response], { type: 'text/json; charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        fileSaver.saveAs(blob, fileObj.original_file_name);
		}), error => {
      console.log(`Error downloading the file ${error}`);
    },
    () => console.info('File downloaded successfully');
  }

}
