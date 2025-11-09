import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Budget } from '../model/Budget';
import { BudgetInitial } from '../model/budgetInitial';
import { TokenStorageService } from './token-storage.service';
import { catchError, take, tap } from 'rxjs/operators';
import { BudgetRevise } from '../model/budgetRevise';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  $eventEmit = new EventEmitter();
  budgetInitial: BudgetInitial;
  budgetRevise: BudgetRevise;
  private apiServerUrl = environment.apiBaseUrl;

  constructor(
    private _router: Router,
    private tokenStorage: TokenStorageService,
    private http: HttpClient,
    private tokenservice: TokenStorageService,
  ) {}

  getBudgets(): Observable<Budget[]> {
    let token = this.tokenStorage.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Budget[]>(`${this.apiServerUrl}/budgets`, { headers });
  }

  public getBudgetInitial(): Observable<BudgetInitial[]> {
    return this.http.get<BudgetInitial[]>(`${this.apiServerUrl}/getBudgetInitial`);
  }
  public getBudgetRevise(): Observable<BudgetRevise[]> {
    return this.http.get<BudgetRevise[]>(`${this.apiServerUrl}/getBudgetRevise`);
  }
  public ajouterBudgetInitial(budgetInitial: BudgetInitial): Observable<BudgetInitial> {
    return this.http.post<BudgetInitial>(this.apiServerUrl + '/ajouterBudgetInitial', budgetInitial);
  }
  public ajouterBudgetRevise(budgetRevise: BudgetRevise): Observable<BudgetRevise> {
    return this.http.post<BudgetRevise>(this.apiServerUrl + '/ajouterBudgetRevise', budgetRevise);
  }
  public affecterBudgetInitialADirection(idBudgetInitial: number, idDirection: number): Observable<void> {
    return this.http.put<void>(
      this.apiServerUrl + '/affecterBudgetInitialADirection/' + idBudgetInitial + '/' + idDirection,
      {},
    );
  }

  public affecterBudgetReviseADirection(idBudgetRevise: number, idDirection: number): Observable<void> {
    return this.http.put<void>(
      this.apiServerUrl + '/affecterBudgetReviseADirection/' + idBudgetRevise + '/' + idDirection,
      {},
    );
  }

  getBudgetInitialById(idbudgetInitial: number): Observable<BudgetInitial> {
    return this.http.get<BudgetInitial>(this.apiServerUrl + '/getBudgetInitialById/' + idbudgetInitial);
  }
  sendEventData(idBudgetInitial: number): any {
    return this.getBudgetInitialById(idBudgetInitial).pipe(
      take(1),
      tap(x => {
        this.budgetInitial = x;
        this.$eventEmit.emit(this.budgetInitial);
        return x;
      }),
      catchError(err => {
        this._router.navigateByUrl('/auth');
        this.tokenStorage.signOut();
        return throwError(err);
      }),
    );
  }

  getBudgetReviseById(idbudgetRevise: number): Observable<BudgetRevise> {
    return this.http.get<BudgetRevise>(this.apiServerUrl + '/getBudgetReviseById/' + idbudgetRevise);
  }
  sendEventData1(idBudgetRevise: number): any {
    return this.getBudgetReviseById(idBudgetRevise).pipe(
      take(1),
      tap(x => {
        this.budgetRevise = x;
        this.$eventEmit.emit(this.budgetRevise);
        return x;
      }),
      catchError(err => {
        this._router.navigateByUrl('/auth');
        this.tokenStorage.signOut();
        return throwError(err);
      }),
    );
  }

  public deleteBudgetInitial(budgetInitialId: number): Observable<void> {
    return this.http.delete<void>(this.apiServerUrl + '/deleteBudgetInitialById/' + budgetInitialId);
  }

  findAllBudgetByEmployeJPQL(idEmploye: number): Observable<Budget[]> {
    const url = `${this.apiServerUrl}/findAllBudgetByEmployeJPQL/${idEmploye}`;
    let token = this.tokenStorage.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Budget[]>(url, { headers });
  }

  validerBudget(
    idBudgetInitial: number,
    idEmploye: number,
    libelle: string,
    dateDebut: string,
    dateFin: string,
    Valide: number,
  ): Observable<void> {
    const token = this.tokenStorage.getToken();
    if (!token) {
      return throwError("Token d'authentification non trouvé");
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Content-Type', 'application/json');

    // Correction de l'ordre des paramètres : Valide avant les dates pour correspondre au backend
    const url = `${this.apiServerUrl}/validerBudget/${idBudgetInitial}/${idEmploye}/${encodeURIComponent(libelle)}/${Valide}/${dateDebut}/${dateFin}`;

    return this.http.put<void>(url, null, { headers }).pipe(
      catchError(error => {
        console.error('Erreur de validation du budget:', error);
        if (error.status === 401) {
          this.tokenStorage.signOut();
          this._router.navigateByUrl('/auth');
        }
        return throwError(error);
      }),
    );
  }

  ajouterBudget(
    idBudgetInitial: number,
    idEmploye: number,
    libelle: string,
    dateDebut: Date,
    dateFin: Date,
  ): Observable<void> {
    let token = this.tokenStorage.getToken();
    console.log(token);
    const httph = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.apiServerUrl}/ajouterBudget/${idBudgetInitial}/${idEmploye}/${encodeURIComponent(libelle)}/${this.formatDate(dateDebut)}/${this.formatDate(dateFin)}/${token}`;

    return this.http.post<void>(url, null, { headers: httph });
  }
  getBd() {
    let token = this.tokenStorage.getToken();
    console.log(token);
    const httph = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiServerUrl + '/bd/' + token);
  }

  private formatDate(date: Date): string {
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = ('0' + (formattedDate.getMonth() + 1)).slice(-2);
    const day = ('0' + formattedDate.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  getBudgetsByBudgetInitialAndDate(emp: string, bi: string, lib: string, dateD: string, dateF: string) {
    const url = `${this.apiServerUrl}/getBudgetsByBudgetInitialAndDate`;
    const params = new HttpParams()
      .set('emp', emp)
      .set('bi', bi)
      .set('lib', lib)
      .set('dateD', dateD)
      .set('dateF', dateF);

    return this.http.get<Budget[]>(url, { params }).pipe(
      tap(budgets => {
        console.log('Budgets:', budgets); // Vérifier les données retournées
      }),
    );
  }

  deleteBudget(budgetId: string): Observable<void> {
    let token = this.tokenStorage.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.apiServerUrl}/deleteBudget/${budgetId}`, { headers });
  }
}
