import { HttpClient } from '@angular/common/http';
import { Injectable,EventEmitter  } from '@angular/core';
import { Observable } from 'rxjs-compat';
import { environment } from '../../environments/environment';
import { Entreprise } from '../model/entreprise';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenStorageService } from './token-storage.service';
@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {
  $eventEmit = new EventEmitter();
  entreprise:Entreprise;
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private _router:Router,private tokenStorage:TokenStorageService,private http: HttpClient){}

  public getEntreprises(): Observable<Entreprise[]> {
    return this.http.get<Entreprise[]>(`${this.apiServerUrl}/getallentreprise`);
  }

  public addEntreprise(entreprise: Entreprise): Observable<Entreprise> {
    return this.http.post<Entreprise>(`${this.apiServerUrl}/ajouterEntreprise`, entreprise);
  }
  getEnrepriseById(idEntreprise:number): Observable<Entreprise> {
    return this.http.get<Entreprise>(this.apiServerUrl+"/getEntrepriseById/"+idEntreprise);
  }
  sendEventData(idEntreprise : number):any{
      
    this.getEnrepriseById(idEntreprise).pipe(take(1)).subscribe(x=>{
      
      this.entreprise=x;
      this.$eventEmit.emit(this.entreprise);
      return x;
    },err => {
      this._router.navigateByUrl("/auth");
      this.tokenStorage.signOut();
    });
    
  }

  

  public deleteEntreprise(entrepriseId: number): Observable<void> {
    return this.http.delete<void>(this.apiServerUrl+"/deleteEntrepriseById/"+entrepriseId);
  }
}
