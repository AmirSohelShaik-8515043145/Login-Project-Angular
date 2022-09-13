import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginform!:FormGroup

  constructor(private fb:FormBuilder) {
    this.loginform=this.fb.group({
      
      'email':['',Validators.required],
      'password':['',Validators.required],
    })
   }

  ngOnInit(): void {
  }
  login(){
    alert("login successfully ")
  }

}
