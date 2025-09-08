import { Component, OnInit } from '@angular/core';
import { Employe } from '../../../model/employe';
import { Direction } from '../../../model/direction';
import { DirectionService } from '../../../services/direction.service';
import { EmployeService } from '../../../services/employe.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../services/token-storage.service';

@Component({
  selector: 'ngx-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.scss', 'list.component.css'],
})
export class ListComponent implements OnInit {
  listdirections: Direction[] = [];
  listemploye: Employe[] = [];
  groupedDirections: { [key: string]: Direction[] } = {}; // Regroupement par entreprise

  constructor(
    private tokenStorage: TokenStorageService,
    private employeService: EmployeService,
    private serviceDirection: DirectionService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.getDirections();
    this.getUsers();
  }

  // Regrouper les directions par entreprise
  private groupByEntreprise(): void {
    this.groupedDirections = this.listdirections.reduce((acc, direction) => {
      if (direction.entreprise && direction.entreprise.name) {
        const entrepriseName = direction.entreprise.name;
        if (!acc[entrepriseName]) {
          acc[entrepriseName] = [];
        }
        acc[entrepriseName].push(direction);
      }
      return acc;
    }, {} as { [key: string]: Direction[] });
  }

  public getDirections(): void {
    this.serviceDirection.getDirections().subscribe(
      (response: Direction[]) => {
        this.listdirections = response || [];
        this.groupByEntreprise();
      },
      (error: HttpErrorResponse) => {
        console.error("Erreur lors de la récupération des directions:", error);
        this._router.navigateByUrl('/auth');
        this.tokenStorage.signOut();
      }
    );
  }

  public getUsers(): void {
    this.employeService.getEmployes().subscribe(
      (data: Employe[]) => {
        this.listemploye = data || [];
        console.log("Employés récupérés :", this.listemploye); // Vérifie si direction est bien un objet
      },
      (error: HttpErrorResponse) => {
        console.error("Erreur lors de la récupération des employés:", error);
        this._router.navigateByUrl('/auth');
        this.tokenStorage.signOut();
      }
    );
  }
  

  public getUsersByDirection(directionId: number): Employe[] {
    return this.listemploye.filter(emp => emp.direction?.id === directionId);
  }
}
