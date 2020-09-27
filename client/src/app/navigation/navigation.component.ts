import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';

import { Component } from '@angular/core';
import { CurrentContextService } from '../services/current-context.service';
import { FileRefreshService } from '../services/file-refresh.service';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { OnInit } from '@angular/core';
import { SharedComponent } from '../components/shared/shared.component';
import { UploadDialogComponent } from '../components/upload-dialog/upload-dialog.component';
import { UserFileApiService } from '../services/user-file.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent extends SharedComponent implements OnInit {

  isHandset$: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);


  constructor(private breakpointObserver: BreakpointObserver,
              protected currentContextService: CurrentContextService,
              protected fileRefreshService: FileRefreshService,
              protected userFileService: UserFileApiService,
              protected dialog: MatDialog) {

    super(currentContextService, dialog, fileRefreshService);
  }

  public ngOnInit(): void {
    this.setupSubscriptions();
  }

  public onLogout(): void{
    localStorage.setItem('isLoggedIn', 'false');
  }

  public onOpenDialog() {
    this.onOpenBasicDialog<UploadDialogComponent>(
      UploadDialogComponent,
      { width: '35%', height: '30%', panelClass: 'custom-dialog-container'});
  }

}
