import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';

import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  isHandset$: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);

  // private _name: string;

  public get name() {
    return localStorage.getItem('emal');
  }

  constructor(private breakpointObserver: BreakpointObserver) {}

}
