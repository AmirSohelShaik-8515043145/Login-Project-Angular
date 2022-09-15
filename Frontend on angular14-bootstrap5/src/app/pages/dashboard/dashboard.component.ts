import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';





@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit {
  pageForm!:FormGroup;
  data: any;
  usersArray: any ;
  userInfo : any;
  totalRecords:any;
  page:any=1;
  singlePage:any;
  isProcess: boolean = false;

  constructor(private fb: FormBuilder,private auth: AuthService) {
    this.pageForm = this.fb.group({
      'page': ['', Validators.compose([Validators.required, Validators.pattern(/(^\d{1}$)|(^\d{2}$)/)])]
    })
  }

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

  jumpPage(pageNumber:any){
    this.auth.jumpPage(pageNumber).subscribe(res => {
      console.log("jumppage api test")
      if (res.status) {
        this.singlePage = res.data
        console.log(this.singlePage)
        console.log("api hit successful")
        // window.location.replace(`login/userdetails/${pageNumber}`)
      }
      else{
        console.log("api hit failed");
      }
    })
  }
}
