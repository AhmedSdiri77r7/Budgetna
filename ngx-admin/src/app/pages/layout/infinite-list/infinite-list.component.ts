import { Component, OnInit } from '@angular/core';
import { BudgetInitial } from '../../../model/budgetInitial';
import { BudgetService } from '../../../services/budget.service';
import { NewsPostComponent } from './news-post/news-post.component';
import { NewsPostPlaceholderComponent } from './news-post-placeholder/news-post-placeholder.component';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ExcelService } from '../../../services/excel.service';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../services/token-storage.service';
import { EmployeService } from '../../../services/employe.service';
import { Employe } from '../../../model/employe';
import { Budget } from '../../../model/Budget';

@Component({
  selector: 'ngx-infinite-list',
  templateUrl: 'infinite-list.component.html',
  styleUrls: ['infinite-list.component.scss'],
})
export class InfiniteListComponent implements OnInit {
  // Budget Initial Data
  public budgetInitials: BudgetInitial[] = [];
  public filteredBudgetInitials: BudgetInitial[] = [];
  public editBudgetInitial: BudgetInitial;
  budgetInitial: BudgetInitial;

  // Employee & Budget Data
  employes: Employe[] = [];
  budgets: Budget[] = [];
  filteredBudgets: Budget[] = [];
  selectedEmployeId: number;

  // UI State
  viewMode: 'grid' | 'list' = 'grid';
  searchTerm: string = '';
  budgetSearchTerm: string = '';
  sortBy: 'name' | 'montant' | 'id' = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';

  // Employee Budget UI State
  employeeBudgetSortBy: 'name' | 'status' | 'date' = 'name';
  employeeBudgetSortOrder: 'asc' | 'desc' = 'asc';
  employeeBudgetPageSize: number = 6;
  employeeBudgetCurrentPage: number = 1;

  // Loading & Pagination
  loading: boolean = false;
  // dedicated loading state for employee budgets section
  employeeLoading: boolean = false;
  pageSize: number = 10;
  currentPage: number = 1;

  constructor(
    private _router: Router,
    private tokenStorage: TokenStorageService,
    private budgetService: BudgetService,
    private dialogService: NbDialogService,
    private excelService: ExcelService,
    private employeService: EmployeService,
    private toastrService: NbToastrService,
  ) {}

  ngOnInit(): void {
    this.loadBudgetInitials();
    this.loadEmployees();
  }

  // ==================== DATA LOADING ====================

  loadBudgetInitials(): void {
    this.loading = true;
    this.budgetService.getBudgetInitial().subscribe(
      data => {
        this.budgetInitials = data;
        this.applyFilters();
        this.loading = false;
      },
      err => {
        console.error('Error loading budget initials:', err);
        this.toastrService.danger('Erreur lors du chargement des budgets initiaux', 'Erreur');
        this.handleAuthError(err);
        this.loading = false;
      },
    );
  }

  loadEmployees(): void {
    this.employeService.getEmployes().subscribe(
      data => {
        this.employes = data || [];
        // Auto-select first employee if none selected and load budgets
        if (!this.selectedEmployeId && this.employes.length > 0) {
          this.selectedEmployeId = this.employes[0].id;
          this.loadBudgetsByEmployee();
        }
      },
      err => {
        console.error('Error loading employees:', err);
        this.handleAuthError(err);
      },
    );
  }

  loadBudgetsByEmployee(): void {
    if (!this.selectedEmployeId) {
      this.budgets = [];
      this.filteredBudgets = [];
      return;
    }

    this.employeeLoading = true;
    this.budgetService.findAllBudgetByEmployeJPQL(this.selectedEmployeId).subscribe(
      response => {
        this.budgets = response || [];
        // reset search term on employee change
        this.budgetSearchTerm = '';
        this.applyBudgetFilters();
        this.toastrService.info(`${this.filteredBudgets.length} budget(s) chargés`, 'Rapport employé');
        this.employeeLoading = false;
      },
      error => {
        console.error('Error fetching budgets:', error);
        this.toastrService.danger('Erreur lors du chargement des budgets', 'Erreur');
        this.handleAuthError(error);
        this.employeeLoading = false;
      },
    );
  }

  // ==================== KPIs ====================

  getTotalBudgetInitials(): number {
    return this.budgetInitials.length;
  }

  getTotalMontant(): number {
    return this.budgetInitials.reduce((sum, b) => sum + (b.tauxBudget || 0), 0);
  }

  getAverageMontant(): string {
    if (this.budgetInitials.length === 0) return '0';
    const avg = this.getTotalMontant() / this.budgetInitials.length;
    return avg.toFixed(2);
  }

  getActiveBudgets(): number {
    return this.budgets.filter(b => b.iSvalide).length;
  }

  // ==================== FILTERS & SEARCH ====================

  applyFilters(): void {
    let filtered = [...this.budgetInitials];

    // Apply search filter
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        b =>
          b.name?.toLowerCase().includes(term) ||
          b.description?.toLowerCase().includes(term) ||
          b.id?.toString().includes(term),
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (this.sortBy) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'montant':
          comparison = (a.tauxBudget || 0) - (b.tauxBudget || 0);
          break;
        case 'id':
          comparison = (a.id || 0) - (b.id || 0);
          break;
      }
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    this.filteredBudgetInitials = filtered;
  }

  applyBudgetFilters(): void {
    let filtered = [...this.budgets];

    // Apply search filter
    if (this.budgetSearchTerm && this.budgetSearchTerm.trim() !== '') {
      const term = this.budgetSearchTerm.toLowerCase();
      filtered = filtered.filter(
        b => b.budgetInitial?.name?.toLowerCase().includes(term) || b.budgetPK?.libelle?.toLowerCase().includes(term),
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (this.employeeBudgetSortBy) {
        case 'name':
          comparison = (a.budgetInitial?.name || '').localeCompare(b.budgetInitial?.name || '');
          break;
        case 'status':
          comparison = (a.iSvalide ? 1 : 0) - (b.iSvalide ? 1 : 0);
          break;
        case 'date':
          const dateA = a.budgetPK?.dateDebut ? new Date(a.budgetPK.dateDebut).getTime() : 0;
          const dateB = b.budgetPK?.dateDebut ? new Date(b.budgetPK.dateDebut).getTime() : 0;
          comparison = dateA - dateB;
          break;
      }
      return this.employeeBudgetSortOrder === 'asc' ? comparison : -comparison;
    });

    this.filteredBudgets = filtered;
    // Reset to first page when filters change
    this.employeeBudgetCurrentPage = 1;
  }

  onEmployeeBudgetSortChange(): void {
    this.applyBudgetFilters();
  }

  toggleEmployeeBudgetSortOrder(): void {
    this.employeeBudgetSortOrder = this.employeeBudgetSortOrder === 'asc' ? 'desc' : 'asc';
    this.applyBudgetFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  // ==================== VIEW CONTROLS ====================

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  // ==================== CRUD OPERATIONS ====================

  onOpenAddDialog(): void {
    this.dialogService.open(NewsPostComponent).onClose.subscribe(result => {
      if (result) {
        this.loadBudgetInitials();
      }
    });
  }

  updateBudgetInitial(idBudgetInitial: number): void {
    this.budgetInitial = this.budgetService.sendEventData(idBudgetInitial);
    this.dialogService.open(NewsPostPlaceholderComponent).onClose.subscribe(result => {
      if (result) {
        this.loadBudgetInitials();
      }
    });
  }

  confirmDelete(id: number, name: string): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le budget "${name}" ?`)) {
      this.deleteBudgetInitial(id);
    }
  }

  deleteBudgetInitial(id: number): void {
    this.loading = true;
    this.budgetService.deleteBudgetInitial(id).subscribe(
      () => {
        this.toastrService.success('Budget initial supprimé avec succès', 'Succès');
        this.loadBudgetInitials();
      },
      err => {
        console.error('Error deleting budget initial:', err);
        this.toastrService.danger('Erreur lors de la suppression', 'Erreur');
        this.handleAuthError(err);
        this.loading = false;
      },
    );
  }

  // ==================== EXPORT ====================

  exportAsXLSX(): void {
    const data = this.filteredBudgetInitials.map(b => ({
      ID: b.id,
      Nom: b.name,
      Description: b.description,
      'Taux Budget (%)': b.tauxBudget,
    }));

    this.excelService.exportAsExcelFile(data, 'budgets_initiaux');
    this.toastrService.success('Export Excel réussi', 'Succès');
  }

  exportBudgetsAsXLSX(): void {
    if (!this.selectedEmployeId) {
      this.toastrService.warning('Veuillez sélectionner un employé', 'Attention');
      return;
    }

    const employee = this.employes.find(e => e.id === this.selectedEmployeId);
    const data = this.filteredBudgets.map(b => ({
      'Budget Initial': b.budgetInitial?.name || '',
      Libellé: b.budgetPK?.libelle || '',
      'Date Début': b.budgetPK?.dateDebut ? new Date(b.budgetPK.dateDebut).toLocaleDateString('fr-FR') : '',
      'Date Fin': b.budgetPK?.dateFin ? new Date(b.budgetPK.dateFin).toLocaleDateString('fr-FR') : '',
      'Taux Budget': b.budgetInitial?.tauxBudget || 0,
      Statut: b.iSvalide ? 'Validé' : 'En attente',
    }));

    const filename = `budgets_${employee?.nom || 'employe'}_${Date.now()}`;
    this.excelService.exportAsExcelFile(data, filename);
    this.toastrService.success('Export Excel réussi', 'Succès');
  }

  // ==================== HELPERS ====================

  getSelectedEmployeeName(): string {
    const emp = this.employes.find(e => e.id === this.selectedEmployeId);
    return emp ? `${emp.prenom} ${emp.nom}` : 'Aucun';
  }

  getDisplayRange(): { start: number; end: number } {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.filteredBudgetInitials.length);
    return { start, end };
  }

  getEmployeeBudgetDisplayRange(): { start: number; end: number } {
    const start = (this.employeeBudgetCurrentPage - 1) * this.employeeBudgetPageSize + 1;
    const end = Math.min(this.employeeBudgetCurrentPage * this.employeeBudgetPageSize, this.filteredBudgets.length);
    return { start, end };
  }

  private handleAuthError(err: any): void {
    if (err.status === 401) {
      this._router.navigateByUrl('/auth');
      this.tokenStorage.signOut();
    }
  }

  // ==================== PAGINATION ====================

  get paginatedItems(): BudgetInitial[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredBudgetInitials.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredBudgetInitials.length / this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  // Employee Budget Pagination
  get paginatedEmployeeBudgets(): Budget[] {
    const start = (this.employeeBudgetCurrentPage - 1) * this.employeeBudgetPageSize;
    const end = start + this.employeeBudgetPageSize;
    return this.filteredBudgets.slice(start, end);
  }

  get employeeBudgetTotalPages(): number {
    return Math.ceil(this.filteredBudgets.length / this.employeeBudgetPageSize);
  }

  goToEmployeeBudgetPage(page: number): void {
    if (page >= 1 && page <= this.employeeBudgetTotalPages) {
      this.employeeBudgetCurrentPage = page;
    }
  }

  nextEmployeeBudgetPage(): void {
    this.goToEmployeeBudgetPage(this.employeeBudgetCurrentPage + 1);
  }

  previousEmployeeBudgetPage(): void {
    this.goToEmployeeBudgetPage(this.employeeBudgetCurrentPage - 1);
  }
}
