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
  formData: any;
  tenure: any;
  maxTotalLoanAmount: any;
  foreClosure: any;
  roi: any;
  dueDay: any;
  topUpInHand: any;
  emi: any;
  minTenure: any;
  maxTenure: any;
  isDataLoaded: boolean = false



  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.emiForm = this.fb.group({
      'topUp': ['', Validators.required],
      'totalLoanAmount': ['', Validators.required],
      'tenure': ['', Validators.required],
      'roi': ['', Validators.required],
      'foreClosure': ['', Validators.required],
      'dueDay': ['', Validators.required],
      'pf': [2],
      'pfRupee': [''],
      'gst': [''],
      'totalPf': ['']
    })
  }

  ngOnInit() {
    this.getUserDetails()
  }



  update(type: any) {
    let topUp, totalLoanAmount, tenure;
    if (type == "topUp" || type == 'tenure') {
      topUp = this.emiForm.value.topUp;
      totalLoanAmount = topUp + this.emiForm.value.foreClosure;
    }
    else if (type == 'totalLoanAmount' || type == 'tenure') {
      totalLoanAmount = this.emiForm.value.totalLoanAmount
      topUp = totalLoanAmount - this.emiForm.value.foreClosure
    }

    tenure = (this.emiForm.value.tenure || this.tenure[this.tenure.length - 1])

    if (topUp && totalLoanAmount) {
      let pfRupee = Math.ceil((totalLoanAmount * this.emiForm.value.pf) / 100)
      let gst = Math.ceil(pfRupee * 18 / 100);
      let totalPf = pfRupee + gst;

      this.topUpInHand = Math.ceil(topUp - totalPf)

      this.emiForm.patchValue({
        topUp: topUp,
        totalLoanAmount: totalLoanAmount,
        pfRupee: pfRupee,
        gst: gst,
        totalPf: totalPf,
        tenure: tenure
      })

      //--------------------------------------------
      let data = this.emiForm.value;

      totalLoanAmount = data.totalLoanAmount;
      let roi = this.emiForm.value.roi / (12 * 100)
      tenure = parseInt(data.tenure);

      this.emi = Math.ceil((totalLoanAmount) * (roi / (1 - Math.pow(1 + roi, - tenure))))
      //--------------------------------------------

    }
  }


  loadDataInFrontend() {
    this.tenure = this.formData.tenure;
    this.maxTotalLoanAmount = this.formData.maxTotalLoanAmount;
    this.foreClosure = this.formData.foreClosure;
    this.roi = this.formData.roi;
    this.maxTenure = this.formData.maxTenure;
    this.minTenure = this.formData.minTenure
    this.isDataLoaded = true

    this.emiForm.patchValue({
      roi:this.roi,
      foreClosure :this.foreClosure
    })

  }



  getUserDetails() {
    this.auth.userLaonDeatils().subscribe(res => {
      console.log('get api hitting')

      let foreClosure = 12760;
      let roi = 18;
      let maxTotalLoanAmount = 600000
      let maxTenure = 60;
      let maxFoir = (60 * 50000) / 100;
      let exIncredObgl = 500//EMI by CM-InCred EMI
      let maxEmi = maxFoir - exIncredObgl;
      let minTenure = Math.ceil((Math.log(maxEmi) - Math.log(maxEmi - (maxTotalLoanAmount * (roi / 1200)))) / Math.log(1 + roi / 1200))
      let arr = [];
      for (let i = minTenure; i <= maxTenure; i++) {
        if (i % 6 == 0) {
          arr.push(i)
        }
      }


      let obj = {
        foreClosure: foreClosure,
        roi: roi,
        tenure: arr,
        maxTotalLoanAmount: maxTotalLoanAmount,
        maxFoir: maxFoir,
        maxTenure: maxTenure,
        maxEmi: maxEmi,
        minTenure: minTenure
      }
      this.formData = obj
      this.loadDataInFrontend()
      return;
    })
  }



  updateUserDetails(){
    console.log('Update Api')
  }
}
