import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileRefreshService {

  private _trigger = new BehaviorSubject<boolean>(false);
  private _showMyShared = new BehaviorSubject<boolean>(false);

  trigger = this._trigger.asObservable();
  showMyShared = this._trigger.asObservable();

  constructor() { }

  public update() {
    this._trigger.next(true);
  }

  public showMySharedFilter() {
    this._showMyShared.next(true);
  }
}
