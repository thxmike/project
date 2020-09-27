import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { catchError, map } from 'rxjs/operators';

import { CurrentContextService } from 'src/app/services/current-context.service';
import { FileRefreshService } from 'src/app/services/file-refresh.service';
import { SharedComponent } from '../shared/shared.component';
import { UserFileApiService } from 'src/app/services/user-file.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent extends SharedComponent implements OnInit {

  private _file: { data: any, name: string,
    inProgress: boolean,
    progress: number } = {
      data: null, name: '', inProgress: false, progress: 0
    };

  private _overridePath: string = this.path;

  public set overridePath(value: string) {
    this._overridePath = value;
  }

  public get overridePath(): string {
    return this._overridePath;
  }

  public get file(): { data: any, name: string, inProgress: boolean, progress: number }{
    return this._file;
  }

  constructor(public dialogRef: MatDialogRef<UploadDialogComponent>,
              protected dialog: MatDialog,
              protected currentContextService: CurrentContextService,
              protected fileRefreshService: FileRefreshService,
              protected userFileService: UserFileApiService,
              protected fb: FormBuilder) {
    super(currentContextService, dialog, fileRefreshService);
  }

  public ngOnInit(): void {
    this.setupSubscriptions();
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onSelectFile(event): void {
    const selectedFile = (event.target as HTMLInputElement).files[0];
    this._file.name = selectedFile.name;
    this._file.data = selectedFile;
    this._file.progress = 0;
    this._file.inProgress = false;
  }

  public onUploadForm(file): void {
    const formData = new FormData();
    formData.append('file', file.data);

    let pth = this.path;
    if (this._overridePath && this._overridePath !== this.path) {
      pth = this._overridePath;
    }

    this.file.inProgress = true;
    this.userFileService.uploadFile(this.userId, pth, formData).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        file.inProgress = false;
        return of(`${this.file.data.name} upload failed. ${error}`);
      })).subscribe((event: any) => {
        if (typeof (event) === 'object') {
          console.log(event.body);
          this.dialogRef.close();
        }
      });
  }

  public setOverride(value){
    this._overridePath = value;
  }

}
