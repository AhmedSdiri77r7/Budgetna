import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Budget } from '../../../../model/Budget';
import { BudgetInitial } from '../../../../model/budgetInitial';

@Component({
  selector: 'ngx-add-budget-dialog',
  templateUrl: './add-budget-dialog.component.html',
  styleUrls: ['./add-budget-dialog.component.scss'],
})
export class AddBudgetDialogComponent implements OnInit {
  @Input() budget?: Budget;
  @Input() budgetInitiaux: BudgetInitial[] = [];
  @Input() isEdit: boolean = false;

  idBudgetInitial: number;
  libelle: string = '';
  dateDebut: string = '';
  dateFin: string = '';

  constructor(protected dialogRef: NbDialogRef<AddBudgetDialogComponent>) {}

  ngOnInit(): void {
    if (this.isEdit && this.budget) {
      this.idBudgetInitial = this.budget.budgetPK?.idBudgetInitial;
      this.libelle = this.budget.budgetPK?.libelle || '';
      this.dateDebut = this.budget.budgetPK?.dateDebut
        ? new Date(this.budget.budgetPK.dateDebut).toISOString().substring(0, 10)
        : '';
      this.dateFin = this.budget.budgetPK?.dateFin
        ? new Date(this.budget.budgetPK.dateFin).toISOString().substring(0, 10)
        : '';
    }
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      this.dialogRef.close({
        idBudgetInitial: this.idBudgetInitial,
        libelle: this.libelle,
        dateDebut: this.dateDebut,
        dateFin: this.dateFin,
      });
    }
  }

  isFormValid(): boolean {
    return !!(this.idBudgetInitial && this.libelle && this.dateDebut && this.dateFin);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
