import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-emi-calculator',
  templateUrl: './emi-calculator.component.html',
  styleUrls: ['./emi-calculator.component.css']
})
export class EmiCalculatorComponent implements OnInit {
  emiForm!: FormGroup;
  emi: number = 0;
  flag: boolean = false;
  exposure: any;
  array: any= [6, 12, 18, 24, 30, 36];
  foreClosure:any;
  test:any = 10

  constructor(private fb: FormBuilder, private auth: AuthService) {

    this.emiForm = this.fb.group({
      'topUp': ['', Validators.required],
      'tenure': ['', Validators.required],
      'roi': [18, Validators.required],
      'foreClosure': ['', Validators.required],
      'exposure': ['', Validators.required],
      'pf': [2, Validators.required],
      'dueDay':[],
      'gst':[]
    })

    if(this.emiForm.value.topUp){
      this.foreClosure = this.emiForm.value.topUp+100000
    }
  }

  ngOnInit(): void {
  }

  emiCalculator() {
    let data = this.emiForm.value;
    console.log(data)
    this.flag = true

    let loanAmount = data.totalLoanAmount;
    let interest = data.finalRoI / 12 / 100;
    let tenure = data.finalTenure;

    this.emi = loanAmount * interest * (Math.pow((1 + interest), tenure) / (Math.pow((1 + interest), tenure) - 1))
    if (this.emi % 1 != 0) {
      this.emi = Math.floor(this.emi)
    }

  }




}
