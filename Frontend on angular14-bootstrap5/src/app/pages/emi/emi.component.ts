import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-emi',
  templateUrl: './emi.component.html',
  styleUrls: ['./emi.component.css']
})
export class EmiComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  emiCalculatorPage(){
    window.location.replace('/emi/emi-calculator')
  }

}
