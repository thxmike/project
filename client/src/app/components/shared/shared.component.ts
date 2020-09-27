import { CurrentContextService } from 'src/app/services/current-context.service';
import { FileRefreshService } from 'src/app/services/file-refresh.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

export class SharedComponent {

  protected _userId: string;
  protected _name: string;
  protected _email: string;
  protected _path = '/';

  public get userId(): string {
    return this._userId;
  }

  public get name(): string {
    return this._name;
  }

  public get email(): string {
    return this._email;
  }

  public get path(): string {
    return this._path;
  }
  protected _dialogSubscription: Subscription;

  constructor(protected currentContextService: CurrentContextService,
              protected dialog: MatDialog,
              protected fileRefreshService: FileRefreshService){

  }

  protected setupSubscriptions(): void{
    this.currentContextService.currentContext.subscribe(
      (context) => {
        this._userId = context.id;
        this._name = context.name;
        this._path = context.path;
        this._email = context.email;
       }
     );
  }

  public onOpenBasicDialog<U>(UCtor: new (...args: any[]) => U,
                              config: any, data: any = null ): void {
    const dialogRef = this.dialog.open(UCtor, {
      width: config.width,
      height: config.height,
      data,
      panelClass: config.panelClass
    });

    this._dialogSubscription = dialogRef.afterClosed().subscribe(() => {
      console.log('Closing Dialog');
      this.fileRefreshService.update();
    });
  }

}
