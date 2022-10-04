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

  constructor(private fb: FormBuilder, private auth: AuthService) {

    this.emiForm = this.fb.group({
      'totalLoanAmount': ['', Validators.required],
      'finalTenure': ['', Validators.compose([Validators.required, Validators.pattern(/(^\d{1}$)|(^\d{2}$)/)])],
      'finalRoI': ['', Validators.required],
    })
  }

  ngOnInit(): void {
  }

  emiCalculator() {
    let data = this.emiForm.value;
    this.flag = true

    let loanAmount = data.totalLoanAmount;
    let interest = data.finalRoI/12/100;
    let tenure = data.finalTenure;

    

    this.emi = loanAmount * interest * (Math.pow((1+interest),tenure)/(Math.pow((1+interest),tenure)-1))
    if(this.emi%1 != 0){
      this.emi = Math.floor(this.emi)
    }
  }

}
