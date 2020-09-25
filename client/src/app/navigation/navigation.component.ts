import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';

import { Component } from '@angular/core';
import { CurrentContextService } from '../services/current-context.service';
import { Observable } from 'rxjs';
import { OnInit } from '@angular/core';
import { SharedComponent } from '../components/shared/shared.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent extends SharedComponent implements OnInit {

  isHandset$: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);


  constructor(private breakpointObserver: BreakpointObserver,
              protected currentContextService: CurrentContextService) {

    super(currentContextService);
  }

  public ngOnInit(): void {
    this.setupSubscriptions();
  }

}
