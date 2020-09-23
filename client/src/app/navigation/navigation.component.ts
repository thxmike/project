import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';

import { Component } from '@angular/core';
import { CurrentUserService } from '../services/current-user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  isHandset$: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);

  private _name: string;

  private _email: string;

  public get name() {
    return this._name;
  }

  public get email() {
    return this._email;
  }

  constructor(private breakpointObserver: BreakpointObserver,
              private currentUserService: CurrentUserService ) {}

  public ngOnInit(): void{
    this.setupSubscriptions();
  }

  private setupSubscriptions(){
    this.currentUserService.currentUser.subscribe(
      (user) => {
         this._name = user[0].first_name ? `${user[0].first_name} ${user[0].last_name}` : user[0].name;
         this._email = user[0].email;
       }
     );
  }

}
