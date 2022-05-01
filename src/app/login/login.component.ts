import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {from} from 'rxjs';

@Component({
  selector: 'grocs-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private afAuth: AngularFireAuth, private router: Router) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }


  submit() {
    if (this.loginForm.valid) {
      from(this.afAuth.auth.signInWithEmailAndPassword(this.loginForm.controls.email.value, this.loginForm.controls.password.value))
        .subscribe(() => this.router.navigate(['dashboard']));
    }
  }

}
