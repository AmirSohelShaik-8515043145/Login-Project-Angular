import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  signup(data: any): Observable<any> {
    return this.http.post('http://localhost:3000/register', data)
  }

  login(data: any): Observable<any> {
    return this.http.post('http://localhost:3000/login', data)
  }

  getuser(): Observable<any> {
    return this.http.get('http://localhost:3000/getuser')
  }

  getprofile(email: any): Observable<any> {
    return this.http.get('http://localhost:3000/getuser/' + email)
  }
  
  jumpPage(pageNumber: any): Observable<any> {
    return this.http.get("http://localhost:3000/getuser/"+pageNumber)
  }

  sendEmail(data: any): Observable<any> {
    return this.http.post('http://localhost:3000/sendEmail', data)
  }

  userLaonDeatils():Observable<any>{
    return this.http.get('https://api.publicapis.org/entries')
  }
}
