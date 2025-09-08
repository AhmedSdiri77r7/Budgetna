import { Component, OnInit } from '@angular/core';
import { BudgetRevise } from '../../../model/budgetRevise';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BudgetService } from '../../../services/budget.service';
import { CompteAnalytiqueComponent } from '../compte-analytique.component';

@Component({
  selector: 'ngx-budget-revise',
  templateUrl: './budget-revise.component.html',
  styleUrls: ['./budget-revise.component.scss']
})
export class BudgetReviseComponent implements OnInit {

  constructor(private _router:Router,private dialogRef:MatDialogRef<CompteAnalytiqueComponent>,private budgetService: BudgetService) { }
  budgetRevise = new BudgetRevise();
  ngOnInit(): void { this.budgetRevise=new BudgetRevise();


    
  }
  addBR() {
    this.budgetService.ajouterBudgetRevise(this.budgetRevise).subscribe(
      () => {
        this.dialogRef.close();
      this._router.navigateByUrl("/pages/compte-analytique").then(()=>window.location.reload());
          console.log(this.budgetRevise);
      },
      (error) => {
        console.error("Erreur lors de l'ajout du Budget Révisé :", error);
      }
    );
  }
}
