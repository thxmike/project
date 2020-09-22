import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private _loginInvalid = false;

  public get loginInvalid(): boolean {
    return this._loginInvalid;
  }

  public form: FormGroup = this.fb.group({
    email: new FormControl('', [
      Validators.required,
      Validators.email]),
    pw: new FormControl('', Validators.required)
  });

  constructor(protected fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
  }

  public get email(){
    return this.form.get('email');
  }

  public get pw(){
    return this.form.get('pw');
  }

  public checkFields(email, pw) {
    let disabled = true;
    if (email.value && pw.value && this.form.get('email').valid){
      disabled = false;
    }
    return disabled;
  }

  public login(email, pw): void{

    // TODO: Call service check credentials if success set the current user using the user service
    localStorage.setItem('isLoggedIn', 'true');
    this._loginInvalid = true;
  }

  public gotoRegistration(): void  {
    localStorage.setItem('isRegistering', 'true');
  }

}
