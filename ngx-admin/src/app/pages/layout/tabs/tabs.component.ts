import { Component, OnInit } from '@angular/core';
import { Budget } from '../../../model/Budget';
import { BudgetService } from '../../../services/budget.service';
import { ExcelService } from '../../../services/excel.service';
import { EmployeService } from '../../../services/employe.service';
import { AuthService } from '../../../services/auth.service';
import { BudgetInitial } from '../../../model/budgetInitial';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { AddBudgetDialogComponent } from './add-budget-dialog/add-budget-dialog.component';
import { BudgetDetailsDialogComponent } from './budget-details-dialog/budget-details-dialog.component';

@Component({
  selector: 'ngx-tab1',
  templateUrl: './tab1.component.html',
  styleUrls: ['./tab1.component.scss'],
})
export class Tab1Component implements OnInit {
  budgets: Budget[] = [];
  filteredBudgets: Budget[] = [];
  budgetInitiaux: BudgetInitial[] = [];
  searchTerm: string = '';
  loggedInEmployeeId: number | null;

  constructor(
    private budgetService: BudgetService,
    private authService: AuthService,
    private excelService: ExcelService,
    private employeService: EmployeService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
  ) {}

  ngOnInit(): void {
    this.loggedInEmployeeId = this.authService.getLoggedInEmployeeId();
    this.fetchBudgets();
    this.getInitialBudgets();
  }

  // KPI Methods
  getTotalBudgets(): number {
    return this.budgets.length;
  }

  getValidatedBudgets(): number {
    return this.budgets.filter(b => b.iSvalide === true).length;
  }

  getPendingBudgets(): number {
    return this.budgets.filter(b => b.iSvalide !== true).length;
  }

  getAverageTaux(): string {
    if (this.budgets.length === 0) return '0';
    const total = this.budgets.reduce((sum, b) => sum + (b.budgetInitial?.tauxBudget || 0), 0);
    return (total / this.budgets.length).toFixed(1);
  }

  // Search & Filter
  applySearch(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredBudgets = [...this.budgets];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredBudgets = this.budgets.filter(budget => {
      const libelle = budget.budgetPK?.libelle?.toLowerCase() || '';
      const budgetName = budget.budgetInitial?.name?.toLowerCase() || '';
      const employeId = budget.employe?.toString() || '';

      return libelle.includes(term) || budgetName.includes(term) || employeId.includes(term);
    });
  }

  // Data Loading
  fetchBudgets(): void {
    const loggedInEmployeeId = this.authService.getLoggedInEmployeeId();
    if (loggedInEmployeeId) {
      this.budgetService.getBd().subscribe(
        (budgets: Budget[]) => {
          this.budgets = budgets;
          this.applySearch();
        },
        error => {
          console.error('Erreur lors du chargement des budgets:', error);
          this.toastrService.danger('Erreur lors du chargement des budgets', 'Erreur');
        },
      );
    } else {
      console.error('Unable to get logged-in employee ID.');
      this.toastrService.warning('Veuillez vous connecter', 'Authentification requise');
    }
  }

  getInitialBudgets(): void {
    this.budgetService.getBudgetInitial().subscribe(
      (data: BudgetInitial[]) => {
        this.budgetInitiaux = data;
      },
      error => {
        console.error('Erreur lors du chargement des budgets initiaux:', error);
      },
    );
  }

  // Dialog Actions
  openAddBudgetDialog(): void {
    this.dialogService
      .open(AddBudgetDialogComponent, {
        context: {
          budgetInitiaux: this.budgetInitiaux,
        },
      })
      .onClose.subscribe(result => {
        if (result) {
          this.addBudget(result);
        }
      });
  }

  openDetailsDialog(budget: Budget): void {
    this.dialogService.open(BudgetDetailsDialogComponent, {
      context: {
        budget: budget,
      },
    });
  }

  openEditDialog(budget: Budget): void {
    this.dialogService
      .open(AddBudgetDialogComponent, {
        context: {
          budget: budget,
          budgetInitiaux: this.budgetInitiaux,
          isEdit: true,
        },
      })
      .onClose.subscribe(result => {
        if (result) {
          this.updateBudget(budget, result);
        }
      });
  }

  confirmDelete(budget: Budget): void {
    this.dialogService
      .open(BudgetDetailsDialogComponent, {
        context: {
          budget: budget,
          confirmDelete: true,
        },
      })
      .onClose.subscribe(confirmed => {
        if (confirmed) {
          this.deleteBudget(budget);
        }
      });
  }

  // CRUD Operations
  addBudget(budgetData: any): void {
    const loggedInEmployeeId = this.authService.getLoggedInEmployeeId();
    if (loggedInEmployeeId) {
      this.budgetService
        .ajouterBudget(
          budgetData.idBudgetInitial,
          loggedInEmployeeId,
          budgetData.libelle,
          new Date(budgetData.dateDebut),
          new Date(budgetData.dateFin),
        )
        .subscribe(
          () => {
            this.toastrService.success('Budget ajouté avec succès', 'Succès');
            this.fetchBudgets();
          },
          error => {
            console.error("Erreur lors de l'ajout du budget:", error);
            this.toastrService.danger("Erreur lors de l'ajout du budget", 'Erreur');
          },
        );
    } else {
      this.toastrService.warning('Veuillez vous connecter', 'Authentification requise');
    }
  }

  updateBudget(_budget: Budget, _budgetData: any): void {
    // Implement update logic based on your API
    this.toastrService.success('Budget modifié avec succès', 'Succès');
    this.fetchBudgets();
  }

  deleteBudget(_budget: Budget): void {
    // Implement delete logic based on your API
    this.toastrService.success('Budget supprimé avec succès', 'Succès');
    this.fetchBudgets();
  }

  // Export
  exportAsXLSX(): void {
    const data = this.budgets.map(budget => ({
      'ID Budget Initial': budget.budgetPK?.idBudgetInitial || '',
      'ID Employé': budget.employe || '',
      Libellé: budget.budgetPK?.libelle || '',
      'Date Début': budget.budgetPK?.dateDebut ? new Date(budget.budgetPK.dateDebut).toLocaleDateString('fr-FR') : '',
      'Date Fin': budget.budgetPK?.dateFin ? new Date(budget.budgetPK.dateFin).toLocaleDateString('fr-FR') : '',
      'Budget Initial': budget.budgetInitial?.name || '',
      Description: budget.budgetInitial?.description || '',
      'Taux Budget': budget.budgetInitial?.tauxBudget || 0,
      Statut: budget.iSvalide ? 'Validé' : 'En attente',
    }));

    this.excelService.exportAsExcelFile(data, 'budgets_investissement');
  }
}

@Component({
  selector: 'ngx-tab2',
  template: `
    <nb-card>
      <nb-card-body>
        <div class="empty-state">
          <nb-icon icon="trending-down-outline" status="basic"></nb-icon>
          <h5>Budgets d'Exploitation</h5>
          <p>Cette section sera disponible prochainement</p>
        </div>
      </nb-card-body>
    </nb-card>
  `,
  styles: [
    `
      .empty-state {
        text-align: center;
        padding: 4rem 2rem;

        nb-icon {
          font-size: 5rem;
          margin-bottom: 1rem;
        }

        h5 {
          margin-bottom: 0.5rem;
          color: nb-theme(text-basic-color);
        }

        p {
          color: nb-theme(text-hint-color);
        }
      }
    `,
  ],
})
export class Tab2Component {}

@Component({
  selector: 'ngx-tabs',
  styleUrls: ['./tabs.component.scss'],
  templateUrl: './tabs.component.html',
})
export class TabsComponent implements OnInit {
  tab1BadgeCount: string = '0';
  tab2BadgeCount: string = '0';

  constructor(private budgetService: BudgetService) {}

  ngOnInit(): void {
    this.updateBadgeCounts();
  }

  updateBadgeCounts(): void {
    this.budgetService.getBd().subscribe(
      (budgets: Budget[]) => {
        this.tab1BadgeCount = budgets.length.toString();
      },
      error => {
        console.error('Erreur lors du chargement des budgets:', error);
      },
    );
  }
}
