import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CurrentContextService } from 'src/app/services/current-context.service';
import { FileRefreshService } from 'src/app/services/file-refresh.service';
import { SharedComponent } from '../shared/shared.component';
import { UserApiService } from 'src/app/services/user.service';
import { UserFileApiService } from 'src/app/services/user-file.service';
import { UserFile } from 'src/app/models/file.model.interface';

@Component({
  selector: 'app-share-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.scss']
})
export class ShareDialogComponent implements OnInit {

  public isValidEmail = true;

  constructor(public dialogRef: MatDialogRef<ShareDialogComponent>,
              protected userService: UserApiService,
              protected userFileService: UserFileApiService,
              @Inject(MAT_DIALOG_DATA) protected data: { userId: string, file: UserFile}) {
  }

  ngOnInit(): void {
  }


  public onClose(): void {
    this.dialogRef.close();
  }

  public onShare(email): void {

    this.userService.getUsers(1, 200).subscribe((users) => {
      const usr = users.find((use) => {
        return use.email.toLowerCase() === email.toLowerCase();
      });
      if (usr){
        let existingShared = this.data.file.shared_user_ids;
        if (!existingShared) {
          existingShared = [usr._id];
        } else {
          existingShared.push(usr._id);
        }
        const payload = {
          shared_user_ids: existingShared
        };

        this.userFileService.updateFile(this.data.userId, this.data.file._id, payload)
          .subscribe((response) => {
            console.log('Share Completed');
            this.onClose();
          });
      } else {
        this.isValidEmail = false;
      }
    });

  }


}
