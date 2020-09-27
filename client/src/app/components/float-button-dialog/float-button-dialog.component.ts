import { Component, OnInit } from '@angular/core';

import { CurrentContextService } from 'src/app/services/current-context.service';
import { FileRefreshService } from 'src/app/services/file-refresh.service';
import { MatDialog } from '@angular/material/dialog';
import { SharedComponent } from '../shared/shared.component';
import { UploadDialogComponent } from '../upload-dialog/upload-dialog.component';

@Component({
  selector: 'app-float-button-dialog',
  templateUrl: './float-button-dialog.component.html',
  styleUrls: ['./float-button-dialog.component.scss']
})
export class FloatButtonDialogComponent extends SharedComponent implements OnInit {

  constructor(protected currentContextService: CurrentContextService,
              protected dialog: MatDialog,
              protected fileRefreshService: FileRefreshService) {
      super(currentContextService, dialog, fileRefreshService);
    }

  ngOnInit(): void {
  }

  public onOpenDialog(): void {
    this.onOpenBasicDialog<UploadDialogComponent>(
      UploadDialogComponent,
      { width: '35%', height: '30%', panelClass: 'custom-dialog-container'});
  }


}
