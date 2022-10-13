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
  formData: any = this.getUserDetails()
  array: any = this.formData.tenure;
  foreClosure: number = this.formData.foreClosure;
  roi: number = this.formData.roi;
  dueDay: number = this.formData.dueDay;
  topUpInHand: any;
  emi: any



  constructor(private fb: FormBuilder, private auth: AuthService) {

    this.emiForm = this.fb.group({
      'topUp': ['', Validators.required],
      'totalLoanAmount': ['', Validators.required],
      'tenure': ['', Validators.required],
      'roi': [this.roi, Validators.required],
      'foreClosure': [this.foreClosure, Validators.required],
      'dueDay': [this.dueDay, Validators.required],
      'pf': [2],
      'pfRupee': [''],
      'gst': [''],
      'totalPf': ['']
    })



  }

  ngOnInit(): void { }



  update(type: any) {
    let topUp, totalLoanAmount;
    if (type == "topUp") {
      topUp = this.emiForm.value.topUp;
      totalLoanAmount = topUp + this.emiForm.value.foreClosure
    }
    else if (type == 'totalLoanAmount') {
      totalLoanAmount = this.emiForm.value.totalLoanAmount
      topUp = totalLoanAmount - this.emiForm.value.foreClosure
    }
    let pfRupee = Math.floor((totalLoanAmount * this.emiForm.value.pf) / 100 + .99)
    let gst = pfRupee * 18 / 100;
    let totalPf = pfRupee + gst;

    this.topUpInHand = (topUp - totalPf)

    this.emiForm.patchValue({
      topUp: topUp,
      totalLoanAmount: totalLoanAmount,
      pfRupee: pfRupee,
      gst: gst,
      totalPf: totalPf
    })



    //--------------------------------------------
    let data = this.emiForm.value;
    let roi = data.roi / 100;
    let tenure = parseInt(data.tenure) / 12;

    console.log(totalLoanAmount, roi, tenure)
    this.emi = Math.ceil((totalLoanAmount * roi / 12) / (1 - Math.pow(1 + roi / 12, -tenure)))
    console.log(this.emi)

    this.emi = Math.ceil(this.emi)
    //--------------------------------------------

  }

  emiCalculator() {
    let data = this.emiForm.value;
    console.log(data)


    let totalLoanAmount = data.totalLoanAmount;
    let roi = data.roi / 100;
    let tenure = parseInt(data.tenure) / 12;

    console.log(totalLoanAmount, roi, tenure)
    this.emi = Math.ceil((totalLoanAmount * roi / 12) / (1 - Math.pow(1 + roi / 12, -tenure)))
    console.log(this.emi)

    this.emi = Math.ceil(this.emi)

  }



  getUserDetails() {
    let data
    let foreClosure = 12760;
    let roi = 18;
    let dueDay = 5;
    let tenure = [12, 18, 24, 30, 36, 42, 54, 60]


    let obj = {
      foreClosure: foreClosure,
      roi: roi,
      dueDay: dueDay,
      tenure: tenure
    }

    this.auth.userLaonDeatils().subscribe(res => {
      console.log('get api hitting')
      if (res.status) {
        data = res.data
        return data;
      }
    })

    return obj
  }






}
