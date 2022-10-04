import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmailDashboardComponent } from './pages/email-dashboard/email-dashboard.component';
import { EmiCalculatorComponent } from './pages/emi/emi-calculator/emi-calculator.component';
import { EmiComponent } from './pages/emi/emi.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'userdetails',component:DashboardComponent},
  {path:'email-dashboard', component:EmailDashboardComponent},
  {path:'emi' , component:EmiComponent},
  {path:'emi/emi-calculator' , component:EmiCalculatorComponent},
  {path:'**',component:LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
