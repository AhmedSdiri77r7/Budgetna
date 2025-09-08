import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Direction } from '../model/direction';
import { TokenStorageService } from './token-storage.service';
@Injectable({
  providedIn: 'root'
})
export class DirectionService {

  $eventEmit = new EventEmitter();
  direction:Direction;
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private _router:Router,private tokenStorage:TokenStorageService,private http: HttpClient){}

  public getDirections(): Observable<Direction[]> {
    return this.http.get<Direction[]>(`${this.apiServerUrl}/getAllDirections`);
  }

  public getDirectionsNamesByEntreprise(idEntreprise:number): Observable<Direction[]> {
    return this.http.get<Direction[]>(this.apiServerUrl+"/getAllDirectiosnNamesByEntreprise/"+idEntreprise);
  }

  public addDirection(direction: Direction,idEntreprise:number): Observable<Direction> {
    return this.http.post<Direction>(this.apiServerUrl+"/ajouterEtAffecterDirectionAEntreprise/"+idEntreprise, direction);
  }
  getDirectionById(idDirection:number): Observable<Direction> {
    return this.http.get<Direction>(this.apiServerUrl+"/getDirectionById/"+idDirection);
  }
  sendEventData(idDirection : number):any{
      
    this.getDirectionById(idDirection).pipe(take(1)).subscribe(x=>{
      
      this.direction=x;
      this.$eventEmit.emit(this.direction);
      return x;
    },err => {
      this._router.navigateByUrl("/auth");
      this.tokenStorage.signOut();
    });
    
  }
  public deleteDirection(directionId: number): Observable<void> {
    return this.http.delete<void>(this.apiServerUrl+"/deleteDirectionById/"+directionId);
  }
}
