import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';





@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit {
  data!: any;
  usersArray: any ;
  userInfo : any;
  totalRecords:any;
  page:any=1;
  isProcess: boolean = false;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.getuser()
  }

  opensweetalert(user:any) {
    Swal.fire(
      user.username,
     `Email : ${user.email} , Phone : ${user.phone} , Age:${user.age}`,
      "success",
    )
  }

  getuser() {
    console.log("amir")
    this.isProcess = true;
    this.auth.getuser().subscribe(res => {
      if (res.status) {
        this.isProcess = false;
        this.usersArray = res.data;
        this.totalRecords = this.usersArray.length
        console.log(this.totalRecords)
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
