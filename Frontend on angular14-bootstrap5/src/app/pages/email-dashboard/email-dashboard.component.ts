import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-email-dashboard',
  templateUrl: './email-dashboard.component.html',
  styleUrls: ['./email-dashboard.component.css']
})
export class EmailDashboardComponent implements OnInit {
  emailform!:FormGroup;
  data:any = ''

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.emailform = this.fb.group({
      'TO': ['', Validators.compose([Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)])],
      'subject':[''],
      'content' : ['',Validators.required]
    })
  }
  ngOnInit(): void {
  }

  opensweetalert() {
    Swal.fire(
      'Success',
      'Email Successfully Send',
      'success'
    ).then(()=>{
      window.location.replace('/email-dashboard')
    })
  }

  sendEmail(){
    let data = this.emailform.value;
    this.auth.sendEmail(data).subscribe(res=>{
      
      if(res.status){
        this.opensweetalert()
      }
    })
  }
}
