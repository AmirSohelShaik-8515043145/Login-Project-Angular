import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  signupForm!: FormGroup;
  message: string = '';
  className = 'd-none'
  isProcess: boolean = false;

  constructor(private fb: FormBuilder, private auth: AuthService) {

    this.signupForm = this.fb.group({
      'username': ['', Validators.compose([Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)])],
      'email': ['', Validators.compose([Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)])],
      'password': ['', Validators.compose([Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)])],
      'phone': ['', Validators.compose([Validators.required, Validators.pattern(/^[6-9]\d{9}$/)])],
      'age': ['', Validators.compose([Validators.required, Validators.pattern(/(^\d{1}$)|(^\d{2}$)/)])]
    })
  }

  ngOnInit(): void {
  }

  opensweetalert() {
    Swal.fire(
      'Success',
      'User Created Succesfully',
      'success'
    )
  }


  signup() {
    this.isProcess = true;
    let data = this.signupForm.value;
    console.log(data)
    delete data['confirm']
    this.auth.signup(data).subscribe(res => {
      if (res.status) {
        this.isProcess = false;
        this.className = 'alert alert-success';
        this.opensweetalert()
        this.signupForm.reset()
      }
      else {
        this.isProcess = false;
        this.message = res.message;
        this.className = 'alert alert-danger';
        this.opensweetalert()
        setTimeout(() => {
          this.message = "";
          this.className = "d-none"
        }, 4000);
        alert("Error")
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
