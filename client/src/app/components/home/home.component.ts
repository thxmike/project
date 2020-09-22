import { Component, OnInit } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public snackBar: MatSnackBar) { }

  open(message, action) {
    this.snackBar.open(message, action);
  }

  ngOnInit(): void {
  }

}
