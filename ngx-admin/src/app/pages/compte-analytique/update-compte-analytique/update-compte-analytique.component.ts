import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BudgetInitial } from '../../../model/budgetInitial';
import { Entreprise } from '../../../model/entreprise';
import { DirectionService } from '../../../services/direction.service';
import { EntrepriseService } from '../../../services/entreprise.service';
import { TokenStorageService } from '../../../services/token-storage.service';
import { Direction } from '../../../model/direction';
import { BudgetService } from '../../../services/budget.service';

@Component({
  selector: 'ngx-update-compte-analytique',
  templateUrl: './update-compte-analytique.component.html',
  styleUrls: ['./update-compte-analytique.component.scss']
})
export class UpdateCompteAnalytiqueComponent implements OnInit {

  direction: Direction = new Direction();
  selectedEntrepriseId: number;
  entreprises: Entreprise[];
  budgetInitials: BudgetInitial[] = [];
  selectedBudgetInitialId: number;

  constructor(
    private _router: Router,
    private serviceBudget: BudgetService,
    private tokenStorage: TokenStorageService,
    private dialogRef: MatDialogRef<UpdateCompteAnalytiqueComponent>,
    private serviceEntreprise: EntrepriseService,
    private serviceDirection: DirectionService
  ) { }

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

    this.serviceBudget.getBudgetInitial().subscribe(
      (data) => {
        this.budgetInitials = data;
      },
      (error) => {
        console.log('Erreur lors de la récupération des budgets initiaux :', error);
      }
    );

    this.direction.budgetInitial = new BudgetInitial();
 

    this.serviceDirection.$eventEmit.subscribe(
      (data) => {
        console.log(this.direction);
        this.direction = data;
        if (data.entreprise != null) {
          this.selectedEntrepriseId = data.entreprise.id;
        }
        console.log(this.direction);
      },
      (err) => {
        this._router.navigateByUrl("/auth");
        this.tokenStorage.signOut();
      }
    );
  }

  affecterBudgetInitialADirection(idBudgetInitial: number, idDirection: number): void {
    this.serviceBudget.affecterBudgetInitialADirection(idBudgetInitial, idDirection).subscribe(
      () => {
        this.dialogRef.close();
        this._router.navigateByUrl("/pages/compte-analytique").then(()=>window.location.reload());


        
        console.log("Le budget initial a été affecté à la direction avec succès.");
        // Perform any additional actions after assigning the budget initial to the direction.
      },
      (err) => {
        console.error("Une erreur s'est produite lors de l'affectation du budget initial à la direction :", err);
      }
    );
  }
  
}
