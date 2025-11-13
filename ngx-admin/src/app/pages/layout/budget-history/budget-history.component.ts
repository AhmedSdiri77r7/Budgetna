import { Component, OnInit, OnDestroy } from '@angular/core';
import { BudgetService } from '../../../services/budget.service';
import { EmployeService } from '../../../services/employe.service';
import { AuthService } from '../../../services/auth.service';
import { Budget } from '../../../model/Budget';
import { Employe } from '../../../model/employe';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { BudgetDetailsComponent } from '../accordion/budget-details/budget-details.component';
import { BudgetInitial } from '../../../model/budgetInitial';
import { BudgetStateService } from '../../../services/budget-state.service';

interface EmployeBudgetHistory {
  employe: Employe;
  budgets: Budget[];
  totalBudgets: number;
  budgetsValides: number;
  budgetsEnAttente: number;
  tauxValidation: number;
}

@Component({
  selector: 'ngx-budget-history',
  templateUrl: './budget-history.component.html',
  styleUrls: ['./budget-history.component.scss'],
})
export class BudgetHistoryComponent implements OnInit, OnDestroy {
  employeBudgetHistories: EmployeBudgetHistory[] = [];
  isLoading = false;
  selectedEmploye: EmployeBudgetHistory | null = null;
  searchTerm = '';
  budgetInitiaux: BudgetInitial[] = [];

  // Filtres
  filterStatus: 'all' | 'valide' | 'enAttente' = 'all';
  sortBy: 'name' | 'totalBudgets' | 'tauxValidation' = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';

  private destroy$ = new Subject<void>();

  constructor(
    private budgetService: BudgetService,
    private employeService: EmployeService,
    private authService: AuthService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private budgetStateService: BudgetStateService,
  ) {
    // S'abonner aux changements d'état
    this.budgetStateService.budgets$.pipe(takeUntil(this.destroy$)).subscribe(budgets => {
      if (budgets && budgets.length > 0) {
        console.log('🔔 Nouveaux budgets reçus via state service:', budgets);
        this.groupBudgetsByEmploye(budgets);
      }
    });
  }

  ngOnInit(): void {
    this.loadBudgetHistory();
    this.loadBudgetInitiaux();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charger l'historique des budgets groupés par employé
   */
  loadBudgetHistory(): void {
    this.isLoading = true;

    console.log("🔄 Début du chargement de l'historique des budgets...");

    // D'abord charger tous les employés, puis leurs budgets
    this.employeService
      .getEmployes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        employes => {
          console.log('👥 Employés reçus:', employes);
          console.log("📊 Nombre d'employés:", employes?.length);

          if (!employes || employes.length === 0) {
            console.warn('⚠️ Aucun employé trouvé');
            this.toastrService.info('Aucun employé disponible', 'Information');
            this.isLoading = false;
            return;
          }

          // Charger les budgets de tous les employés
          this.loadAllEmployeesBudgets(employes);
        },
        error => {
          console.error('❌ Erreur lors du chargement des employés:', error);
          this.toastrService.danger('Impossible de charger la liste des employés', 'Erreur');
          this.isLoading = false;
        },
      );
  }

  /**
   * Charger les budgets de tous les employés
   */
  private loadAllEmployeesBudgets(employes: Employe[]): void {
    const allBudgets: Budget[] = [];
    let completedRequests = 0;

    console.log('🔄 Chargement des budgets pour', employes.length, 'employés...');

    employes.forEach(employe => {
      this.budgetService
        .findAllBudgetByEmployeJPQL(employe.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          budgets => {
            console.log(`✅ Budgets de ${employe.nom} ${employe.prenom}:`, budgets?.length || 0);

            if (budgets && budgets.length > 0) {
              allBudgets.push(...budgets);
            }

            completedRequests++;

            // Quand toutes les requêtes sont terminées
            if (completedRequests === employes.length) {
              console.log('✅ Total budgets chargés:', allBudgets.length);

              if (allBudgets.length === 0) {
                this.toastrService.info('Aucun budget trouvé pour les employés', 'Information');
                this.isLoading = false;
                return;
              }

              this.groupBudgetsByEmploye(allBudgets);
              this.isLoading = false;
            }
          },
          error => {
            console.error(`❌ Erreur budgets pour ${employe.nom}:`, error);
            completedRequests++;

            if (completedRequests === employes.length) {
              if (allBudgets.length > 0) {
                this.groupBudgetsByEmploye(allBudgets);
              } else {
                this.toastrService.warning('Aucun budget disponible', 'Attention');
              }
              this.isLoading = false;
            }
          },
        );
    });
  }

  /**
   * Grouper les budgets par employé et calculer les statistiques
   */
  private groupBudgetsByEmploye(budgets: Budget[]): void {
    const employeMap = new Map<number, Budget[]>();

    console.log('🔍 Groupement des budgets par employé...');

    // Grouper les budgets par ID employé
    budgets.forEach(budget => {
      const employeId = budget.budgetPK?.idEmploye || budget.employe;
      console.log('Budget:', budget, 'employeId extrait:', employeId);

      if (employeId) {
        if (!employeMap.has(employeId)) {
          employeMap.set(employeId, []);
        }
        employeMap.get(employeId)!.push(budget);
      } else {
        console.warn('⚠️ Budget sans ID employé:', budget);
      }
    });

    console.log('📋 Map des employés créée:', employeMap);
    console.log("👥 Nombre d'employés trouvés:", employeMap.size);

    // Charger les informations des employés
    const employeIds = Array.from(employeMap.keys());
    console.log('🆔 IDs des employés à charger:', employeIds);

    if (employeIds.length === 0) {
      console.warn('⚠️ Aucun ID employé trouvé dans les budgets');
      this.toastrService.warning('Aucun employé trouvé dans les budgets', 'Attention');
      return;
    }

    this.loadEmployeDetails(employeIds, employeMap);
  }

  /**
   * Charger les détails des employés
   */
  private loadEmployeDetails(employeIds: number[], employeMap: Map<number, Budget[]>): void {
    console.log('👤 Chargement des détails des employés...');

    this.employeService
      .getEmployes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        employes => {
          console.log('✅ Employés reçus:', employes);
          console.log("👥 Nombre total d'employés:", employes?.length);

          const filteredEmployes = employes.filter(emp => employeIds.includes(emp.id));
          console.log('🔍 Employés filtrés (ayant des budgets):', filteredEmployes);

          this.employeBudgetHistories = filteredEmployes.map(employe => {
            const budgets = employeMap.get(employe.id) || [];
            const budgetsValides = budgets.filter(b => b.iSvalide).length;
            const totalBudgets = budgets.length;
            const budgetsEnAttente = totalBudgets - budgetsValides;
            const tauxValidation = totalBudgets > 0 ? (budgetsValides / totalBudgets) * 100 : 0;

            return {
              employe,
              budgets,
              totalBudgets,
              budgetsValides,
              budgetsEnAttente,
              tauxValidation: Math.round(tauxValidation * 100) / 100,
            };
          });

          console.log('📊 Historiques créés:', this.employeBudgetHistories);
          console.log("✅ Nombre d'historiques:", this.employeBudgetHistories.length);

          // Appliquer le tri initial
          this.applySorting();

          if (this.employeBudgetHistories.length === 0) {
            this.toastrService.info('Aucun budget trouvé pour les employés', 'Information');
          } else {
            this.toastrService.success(
              `${this.employeBudgetHistories.length} employé(s) avec budgets chargé(s)`,
              'Succès',
            );
          }
        },
        error => {
          console.error('❌ Erreur lors du chargement des employés:', error);
          this.toastrService.danger('Impossible de charger les informations des employés', 'Erreur');
        },
      );
  }

  /**
   * Sélectionner un employé pour voir ses budgets en détail
   */
  selectEmploye(history: EmployeBudgetHistory): void {
    this.selectedEmploye = this.selectedEmploye === history ? null : history;
  }

  /**
   * Obtenir les budgets filtrés pour un employé
   */
  getFilteredBudgets(history: EmployeBudgetHistory): Budget[] {
    let budgets = history.budgets;

    // Filtrer par statut
    if (this.filterStatus === 'valide') {
      budgets = budgets.filter(b => b.iSvalide);
    } else if (this.filterStatus === 'enAttente') {
      budgets = budgets.filter(b => !b.iSvalide);
    }

    return budgets;
  }

  /**
   * Obtenir les historiques filtrés
   */
  get filteredHistories(): EmployeBudgetHistory[] {
    let histories = this.employeBudgetHistories;

    // Recherche par nom d'employé
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      histories = histories.filter(
        h =>
          h.employe.nom?.toLowerCase().includes(term) ||
          h.employe.prenom?.toLowerCase().includes(term) ||
          h.employe.email?.toLowerCase().includes(term),
      );
    }

    return histories;
  }

  /**
   * Changer le tri
   */
  changeSorting(sortBy: 'name' | 'totalBudgets' | 'tauxValidation'): void {
    if (this.sortBy === sortBy) {
      // Inverser l'ordre si on clique sur la même colonne
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortBy;
      this.sortOrder = 'asc';
    }
    this.applySorting();
  }

  /**
   * Appliquer le tri
   */
  private applySorting(): void {
    this.employeBudgetHistories.sort((a, b) => {
      let comparison = 0;

      switch (this.sortBy) {
        case 'name':
          comparison = (a.employe.nom || '').localeCompare(b.employe.nom || '');
          break;
        case 'totalBudgets':
          comparison = a.totalBudgets - b.totalBudgets;
          break;
        case 'tauxValidation':
          comparison = a.tauxValidation - b.tauxValidation;
          break;
      }

      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  /**
   * Exporter l'historique en Excel
   */
  exportToExcel(): void {
    const data = this.filteredHistories.map(h => ({
      Nom: h.employe.nom,
      Prénom: h.employe.prenom,
      Email: h.employe.email,
      'Total Budgets': h.totalBudgets,
      'Budgets Validés': h.budgetsValides,
      'Budgets En Attente': h.budgetsEnAttente,
      'Taux de Validation (%)': h.tauxValidation,
    }));

    // Utiliser le service Excel existant
    import('../../../services/excel.service').then(module => {
      const excelService = new module.ExcelService();
      excelService.exportAsExcelFile(data, 'historique_budgets_employes');
      this.toastrService.success('Export Excel réussi', 'Succès');
    });
  }

  /**
   * Rafraîchir les données
   */
  refresh(): void {
    this.selectedEmploye = null;
    this.loadBudgetHistory();
  }

  /**
   * Obtenir la classe de badge pour le statut
   */
  getStatusBadgeClass(budget: Budget): string {
    return budget.iSvalide ? 'success' : 'warning';
  }

  /**
   * Obtenir le texte du statut
   */
  getStatusText(budget: Budget): string {
    return budget.iSvalide ? 'Validé' : 'En attente';
  }

  /**
   * Calculer le total de budgets
   */
  getTotalBudgets(): number {
    return this.filteredHistories.reduce((sum, h) => sum + h.totalBudgets, 0);
  }

  /**
   * Calculer le total de budgets validés
   */
  getTotalBudgetsValides(): number {
    return this.filteredHistories.reduce((sum, h) => sum + h.budgetsValides, 0);
  }

  /**
   * Calculer le total de budgets en attente
   */
  getTotalBudgetsEnAttente(): number {
    return this.filteredHistories.reduce((sum, h) => sum + h.budgetsEnAttente, 0);
  }

  /**
   * Charger les budgets initiaux pour le modal
   */
  private loadBudgetInitiaux(): void {
    this.budgetService
      .getBudgetInitial()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        budgetInitiaux => {
          this.budgetInitiaux = budgetInitiaux;
        },
        error => {
          console.error('Erreur lors du chargement des budgets initiaux:', error);
        },
      );
  }

  /**
   * Ouvrir les détails d'un budget dans un modal
   */
  openBudgetDetails(budget: Budget, employe: Employe): void {
    const isChefDepartement = this.authService.isChefDepartement();
    const mode = !budget.iSvalide && isChefDepartement ? 'validate' : 'view';

    this.dialogService
      .open(BudgetDetailsComponent, {
        context: {
          budget: budget,
          employeInfo: employe,
          mode: mode,
          budgetInitiaux: this.budgetInitiaux,
        },
        dialogClass: 'budget-details-dialog',
      })
      .onClose.subscribe(result => {
        if (result) {
          // Recharger l'historique si le budget a été modifié
          this.loadBudgetHistory();
        }
      });
  }
}
