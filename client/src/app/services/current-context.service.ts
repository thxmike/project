import { BehaviorSubject } from 'rxjs';
import { Context } from '../models/user.model.interface';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrentContextService {

  private _contextSource = new BehaviorSubject<Context>({
    id: '',
    name: '',
    email: '',
    path: '/'
  });

  currentContext = this._contextSource.asObservable();

  constructor() { }

  public setCurrentContext(context: Context) {
    this._contextSource.next(context);
  }

}
