import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';

import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isHandset$: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);

  title = 'File Management';

  // Fake the login process
  public get isLoggedIn(): boolean{

    return localStorage.getItem('isLoggedIn') === 'true';
  }

  public get isRegistering(): boolean{

    return localStorage.getItem('isRegistering') === 'true';
  }

  public constructor(
    private breakpointObserver: BreakpointObserver,
    ) {

      localStorage.setItem('isLoggedIn', 'false');
      localStorage.setItem('isRegistering', 'false');

    }
}
