import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model.interface';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  private _userSource = new BehaviorSubject<User>({
    id: '0',
    name: '',
    email: ''
  });

  currentUser = this._userSource.asObservable();

  constructor() { }

  setCurrentUser(user: User) {
    this._userSource.next(user);
  }

}
