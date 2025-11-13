import { Component, OnInit } from '@angular/core';
import { BudgetRevise } from '../../../model/budgetRevise';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BudgetService } from '../../../services/budget.service';
import { CompteAnalytiqueComponent } from '../compte-analytique.component';
import { BudgetStateService } from '../../../services/budget-state.service';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-budget-revise',
  templateUrl: './budget-revise.component.html',
  styleUrls: ['./budget-revise.component.scss'],
})
export class BudgetReviseComponent implements OnInit {
  budgetRevise = new BudgetRevise();
  isLoading = false;

  constructor(
    private _router: Router,
    private dialogRef: MatDialogRef<CompteAnalytiqueComponent>,
    private budgetService: BudgetService,
    private budgetState: BudgetStateService,
    private toastrService: NbToastrService,
  ) {}

  ngOnInit(): void {
    this.budgetRevise = new BudgetRevise();
  }

  addBR() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.budgetService.ajouterBudgetRevise(this.budgetRevise).subscribe(
      result => {
        // Mettre à jour le state au lieu de recharger la page
        this.budgetState.addBudgetRevise(result);

        this.toastrService.success('Le budget révisé a été ajouté avec succès', 'Succès');
        this.dialogRef.close(result); // Passer le résultat au parent
        this.isLoading = false;
      },
      error => {
        console.error("Erreur lors de l'ajout du Budget Révisé :", error);
        this.toastrService.danger("Erreur lors de l'ajout du budget révisé", 'Erreur');
        this.isLoading = false;
      },
    );
  }
}
