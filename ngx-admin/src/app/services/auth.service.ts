import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


import { Employe } from '../model/employe';
import { TokenStorageService } from './token-storage.service';

const AUTH_API = 'http://localhost:8081/oauth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { }

  login(credentials): Observable<any> {
    console.log("credentials email : "+credentials.email+"credentials email : "+credentials.password)
    return this.http.post(AUTH_API + 'signin', {
      email: credentials.email,
      password: credentials.password
    }, httpOptions);
  }

  register(employe): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      nom: employe.nom,
      prenom: employe.prenom,
      email: employe.email,
      password: employe.password,
      role: employe.role
    }, httpOptions);
  }
  getEmployeId(): number | null {
    const employe = this.getAuthenticatedEmploye(); // Remplacez par votre logique pour obtenir l'employé authentifié
    return employe ? employe.id : null;
  }
  
  

  private getAuthenticatedEmploye(): any {  const employe = JSON.parse(localStorage.getItem('employe'));
  return employe;
}
getLoggedInEmployeeId(): number | null {
  const user = this.tokenStorage.getUser();
  return user ? user.id : null;
}
}
