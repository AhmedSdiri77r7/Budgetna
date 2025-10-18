import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs-compat';
import { take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Employe } from '../model/employe';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeService {
  employe:Employe;
  employeObject:Employe = new Employe(); 
  $eventEmit = new EventEmitter();
  
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private _router:Router,private tokenStorage:TokenStorageService,private http: HttpClient){}

  public getEmployes(): Observable<Employe[]> {
    return this.http.get<Employe[]>(`${this.apiServerUrl}/getAllEmployes`);
  }
  public getAllEmployeNamesJPQL(): Observable<Employe[]> {
    return this.http.get<Employe[]>(`${this.apiServerUrl}/getAllEmployeNamesJPQL`);
  }
  public addEmploye(employe: Employe,idDirection:number): Observable<Employe> {
    return this.http.post<Employe>(this.apiServerUrl+"/ajouterEmployeEtAffecterDirection/"+idDirection, employe);
  }
  public addEmploye1(employe: Employe): Observable<Employe> {
    return this.http.post<Employe>(this.apiServerUrl+"/ajouterEmployer/",employe);
  }
  public affecterEmployeADirection(idDirection: number, idEmploye: number): Observable<Employe> {
    return this.http.put<Employe>(this.apiServerUrl + "/affecterEmployeADirection/" +  idDirection + "/" + idEmploye  , {});
  }
  
  getEmployePrenomById(idEmploye:number): Observable<Employe> {
    return this.http.get<Employe>(this.apiServerUrl+"/getEmployePrenomById/"+idEmploye);
  }
  getEmployeById(idEmploye:number): Observable<Employe> {
    return this.http.get<Employe>(this.apiServerUrl+"/getemployeById/"+idEmploye);
  }
  sendEventData(idEmploye : number):any{
      
    this.getEmployeById(idEmploye).pipe(take(1)).subscribe(x=>{
      
      this.employe=x;
      this.$eventEmit.emit(this.employe);
      return x;
    },err => {
      this._router.navigateByUrl("/auth");
      this.tokenStorage.signOut();
    });
    
  }
  
  public deleteEmploye(employeId: number): Observable<void> {
    return this.http.delete<void>(this.apiServerUrl+"/deleteEmployeById/"+employeId);
  }

  getEmployerByDirection(idDirection : number):any{
    console.log(idDirection);
    return this.http.get<Employe>(this.apiServerUrl+"/getEmployeByDirection/"+idDirection)
  }

  getEmployeByEmail(email: String):any{
    console.log("email in service :"+email);
    console.log("type of email in service :"+typeof(email));
    return this.http.get<Employe>(this.apiServerUrl+"/getEmployeByEmail/"+email)
  }


  
}
