import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Entreprise } from '../../../model/entreprise';
import { DirectionService } from '../../../services/direction.service';
import { EntrepriseService } from '../../../services/entreprise.service';
import { TokenStorageService} from '../../../services/token-storage.service';
import { Direction } from '../../../model/direction';
import { BudgetRevise } from '../../../model/budgetRevise';
import { BudgetService } from '../../../services/budget.service';

@Component({
  selector: 'ngx-add-compte-analytique',
  templateUrl: './add-compte-analytique.component.html',
  styleUrls: ['./add-compte-analytique.component.scss'],
})
export class AddCompteAnalytiqueComponent implements OnInit {
  directions: Direction[];
  selectedEntrepriseId: number;
  entreprises: Entreprise[];
  budgetRevises: BudgetRevise[] = [];
  selectedBudgetReviseId: number;
  selectedDirectionId: number;


  constructor(
    private _router: Router,
    private tokenStorage: TokenStorageService,
    private dialogRef: MatDialogRef<AddCompteAnalytiqueComponent>,
    private serviceEntreprise: EntrepriseService,
    private serviceDirection: DirectionService,
    private budgetService: BudgetService,
  ) {}

  ngOnInit(): void {
    this.serviceEntreprise.getEntreprises().subscribe(
      (data) => {
        this.entreprises = data;
      },
      (err) => {
        this._router.navigateByUrl("/auth");
        this.tokenStorage.signOut();
      }
    );

    this.budgetService.getBudgetRevise().subscribe(
      (data) => {
        this.budgetRevises = data;
      },
      (error) => {
        console.log('Erreur lors de la récupération des budgets revises:', error);
      }
    );

    this.serviceDirection.getDirections().subscribe(
      (data) => {
        this.directions = data;
      },
      (err) => {
        this._router.navigateByUrl("/auth");
        this.tokenStorage.signOut();
      }
    );
  }
  

  affecterBudgetReviseADirection(idBudgetRevise: number, idDirection): void {
  
      this.budgetService.affecterBudgetReviseADirection(idBudgetRevise, idDirection).subscribe(
        () => {

          this.dialogRef.close();
      this._router.navigateByUrl("/pages/compte-analytique").then(()=>window.location.reload());
          console.log('Le budget révisé a été affecté à la direction avec succès.');
        },
        (err) => {
          console.error("Une erreur s'est produite lors de l'affectation du budget révisé à la direction :", err);
          // You can display an error message to the user here.
        }
      );
   
  }
  
}
