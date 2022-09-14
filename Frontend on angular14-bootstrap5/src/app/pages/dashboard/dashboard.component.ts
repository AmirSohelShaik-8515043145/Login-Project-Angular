import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';





@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit {
  data!: any;
  message: any ;
  className = 'd-none'
  isProcess: boolean = false;

  userlist = ["amir", "sohel", "shaik", "amir", "sohel", "shaik"]

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.getuser()
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
}
