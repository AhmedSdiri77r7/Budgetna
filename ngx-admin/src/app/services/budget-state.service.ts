import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Budget } from '../model/Budget';
import { BudgetInitial } from '../model/budgetInitial';
import { BudgetRevise } from '../model/budgetRevise';

/**
 * Service centralisé pour gérer l'état global des budgets
 * Améliore la réactivité et élimine les window.location.reload()
 */
@Injectable({
  providedIn: 'root',
})
export class BudgetStateService {
  // Budgets
  private budgetsSubject = new BehaviorSubject<Budget[]>([]);
  private selectedBudgetSubject = new BehaviorSubject<Budget | null>(null);

  // Budgets Initiaux
  private budgetInitiauxSubject = new BehaviorSubject<BudgetInitial[]>([]);

  // Budgets Révisés
  private budgetRevisesSubject = new BehaviorSubject<BudgetRevise[]>([]);

  // Loading & Error states
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  // Observables publics
  budgets$ = this.budgetsSubject.asObservable();
  selectedBudget$ = this.selectedBudgetSubject.asObservable();
  budgetInitiaux$ = this.budgetInitiauxSubject.asObservable();
  budgetRevises$ = this.budgetRevisesSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

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

  // ========== Budgets Initiaux ==========
  getBudgetInitiaux(): BudgetInitial[] {
    return this.budgetInitiauxSubject.getValue();
  }

  setBudgetInitiaux(budgets: BudgetInitial[]): void {
    this.budgetInitiauxSubject.next(budgets);
  }

  addBudgetInitial(budget: BudgetInitial): void {
    const currentBudgets = this.getBudgetInitiaux();
    this.budgetInitiauxSubject.next([...currentBudgets, budget]);
  }

  updateBudgetInitial(updatedBudget: BudgetInitial): void {
    const currentBudgets = this.getBudgetInitiaux();
    const index = currentBudgets.findIndex(b => b.id === updatedBudget.id);

    if (index !== -1) {
      const updatedBudgets = [...currentBudgets];
      updatedBudgets[index] = updatedBudget;
      this.budgetInitiauxSubject.next(updatedBudgets);
    }
  }

  deleteBudgetInitial(budgetId: number): void {
    const currentBudgets = this.getBudgetInitiaux();
    const filteredBudgets = currentBudgets.filter(b => b.id !== budgetId);
    this.budgetInitiauxSubject.next(filteredBudgets);
  }

  // ========== Budgets Révisés ==========
  getBudgetRevises(): BudgetRevise[] {
    return this.budgetRevisesSubject.getValue();
  }

  setBudgetRevises(budgets: BudgetRevise[]): void {
    this.budgetRevisesSubject.next(budgets);
  }

  addBudgetRevise(budget: BudgetRevise): void {
    const currentBudgets = this.getBudgetRevises();
    this.budgetRevisesSubject.next([...currentBudgets, budget]);
  }

  updateBudgetRevise(updatedBudget: BudgetRevise): void {
    const currentBudgets = this.getBudgetRevises();
    const index = currentBudgets.findIndex(b => b.id === updatedBudget.id);

    if (index !== -1) {
      const updatedBudgets = [...currentBudgets];
      updatedBudgets[index] = updatedBudget;
      this.budgetRevisesSubject.next(updatedBudgets);
    }
  }

  // ========== Loading & Error States ==========
  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  setError(error: string | null): void {
    this.errorSubject.next(error);
  }

  clearError(): void {
    this.errorSubject.next(null);
  }

  // ========== Statistiques pour Dashboard ==========
  getBudgetStats(): {
    totalBudgets: number;
    budgetsValides: number;
    budgetsEnAttente: number;
    tauxValidation: number;
  } {
    const budgets = this.budgetsSubject.getValue();
    const total = budgets.length;
    const valides = budgets.filter(b => b.iSvalide).length;
    const enAttente = total - valides;
    const tauxValidation = total > 0 ? (valides / total) * 100 : 0;

    return {
      totalBudgets: total,
      budgetsValides: valides,
      budgetsEnAttente: enAttente,
      tauxValidation: Math.round(tauxValidation * 100) / 100,
    };
  }

  // ========== Réinitialisation complète ==========
  reset(): void {
    this.budgetsSubject.next([]);
    this.budgetInitiauxSubject.next([]);
    this.budgetRevisesSubject.next([]);
    this.selectedBudgetSubject.next(null);
    this.loadingSubject.next(false);
    this.errorSubject.next(null);
  }
}
