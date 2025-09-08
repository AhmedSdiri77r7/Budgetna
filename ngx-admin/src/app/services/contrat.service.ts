import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Contrat } from '../model/contrat';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ContratService {

  $eventEmit = new EventEmitter();
  contrat:Contrat;
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private _router:Router,private tokenStorage:TokenStorageService,private http: HttpClient){}

  public getContrats(): Observable<Contrat[]> {
    return this.http.get<Contrat[]>(`${this.apiServerUrl}/getAllContrats`);
  }

  public addContrat(contrat: Contrat,idEmploye:number): Observable<Contrat> {
    return this.http.post<Contrat>(this.apiServerUrl+"/ajouterEtAffecterContratAEmploye/"+idEmploye, contrat);
  }
  getContratById(idContrat:number): Observable<Contrat> {
    return this.http.get<Contrat>(this.apiServerUrl+"/getcontratById/"+idContrat);
  }
  sendEventData(idContrat : number):any{
      
    this.getContratById(idContrat).pipe(take(1)).subscribe(x=>{
      
      this.contrat=x;
      this.$eventEmit.emit(this.contrat);
      return x;
    },err => {
      this._router.navigateByUrl("/auth");
      this.tokenStorage.signOut();
    })
    
  }
  public deleteContrat(contratId: number): Observable<void> {
    return this.http.delete<void>(this.apiServerUrl+"/deleteContratById/"+contratId);
  }
}
