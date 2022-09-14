import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';





@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit {
  data!: any;
  message: any ;
  userInfo : any
  className = 'd-none'
  isProcess: boolean = false;
  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.getuser()
  }

  opensweetalert(x:any) {
    Swal.fire(
      x.username,
     `Email:${x.email} ,Phone:${x.phone}`,
      "success",
      
    )
  }

  getuser() {
    console.log("amir")
    this.isProcess = true;
    this.auth.getuser().subscribe(res => {
      if (res.status) {
        this.isProcess = false;
        this.message = res.data;
        console.log(this.message)
      }
    })
  }

  getprofile(email:any) {
    this.isProcess = true;
    this.auth.getprofile(email).subscribe(res => {
      if (res.status) {
        this.isProcess = false;
        this.userInfo = res.data;
        console.log(this.userInfo)
        this.opensweetalert(this.userInfo)
      }
    })
  }
}
