import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup
  message: string = '';
  className = 'd-none'
  isProcess: boolean = false;

  constructor(private fb: FormBuilder,private auth:AuthService) {
    this.loginForm = this.fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)])],
      'password': ['', Validators.compose([Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)])],
    })
  }

  ngOnInit(): void {
  }

  opensweetalert() {
    Swal.fire(
      'Success',
      'You are Succesfully Logged in ',
      'success'
    ).then(()=>{
      window.location.replace('/login/userdetails')
    })
  }

  login() {
    this.isProcess = true;
    let data = this.loginForm.value;
    console.log(data)
    console.log(window.location.href)
    delete data['confirm']
    this.auth.login(data).subscribe(res => {
      if (res.status) {
        this.isProcess = false;
        this.opensweetalert()
        
        
      }
      else {
        this.isProcess = false;
        this.message = res.message;
        this.className = 'alert alert-danger';
        setTimeout(() => {
          this.message = "";
          this.className = "d-none"
        }, 4000)
      }
    }, err => {
      this.isProcess = false;
      this.message = "Server Error !!";
      this.className = 'alert alert-danger'
      this.message = err.error.message
      setTimeout(() => {
        this.message = "";
        this.className = "d-none"
      }, 4000)
    })
  }
}
