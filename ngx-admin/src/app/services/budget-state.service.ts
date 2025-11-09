import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Budget } from '../model/Budget';

@Injectable({
  providedIn: 'root',
})
export class BudgetStateService {
  private budgetsSubject = new BehaviorSubject<Budget[]>([]);
  private selectedBudgetSubject = new BehaviorSubject<Budget | null>(null);

  budgets$ = this.budgetsSubject.asObservable();
  selectedBudget$ = this.selectedBudgetSubject.asObservable();

  constructor() {}

  // Mise à jour des budgets
  updateBudgets(budgets: Budget[]): void {
    this.budgetsSubject.next(budgets);
  }

  // Récupérer les budgets actuels
  getBudgets(): Budget[] {
    return this.budgetsSubject.getValue();
  }

  // Sélectionner un budget
  selectBudget(budget: Budget): void {
    this.selectedBudgetSubject.next(budget);
  }

  // Réinitialiser la sélection
  clearSelection(): void {
    this.selectedBudgetSubject.next(null);
  }

  // Ajouter un budget
  addBudget(budget: Budget): void {
    const currentBudgets = this.getBudgets();
    this.budgetsSubject.next([...currentBudgets, budget]);
  }

  // Supprimer un budget
  removeBudget(budgetId: string): void {
    const currentBudgets = this.getBudgets();
    const updatedBudgets = currentBudgets.filter(b => b.budgetPK.idEmploye.toString() !== budgetId);
    this.budgetsSubject.next(updatedBudgets);
  }

  // Mettre à jour un budget
  updateBudget(updatedBudget: Budget): void {
    const currentBudgets = this.getBudgets();
    const index = currentBudgets.findIndex(
      b =>
        b.budgetPK.idEmploye === updatedBudget.budgetPK.idEmploye &&
        b.budgetPK.libelle === updatedBudget.budgetPK.libelle,
    );

    if (index !== -1) {
      const updatedBudgets = [...currentBudgets];
      updatedBudgets[index] = updatedBudget;
      this.budgetsSubject.next(updatedBudgets);
    }
  }
}
