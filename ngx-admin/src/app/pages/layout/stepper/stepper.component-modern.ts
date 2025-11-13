import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../services/token-storage.service';
import { EmployeService } from '../../../services/employe.service';
import { Employe } from '../../../model/employe';
import { NbToastrService } from '@nebular/theme';
import { ExcelService } from '../../../services/excel.service';

@Component({
  selector: 'ngx-stepper',
  templateUrl: 'stepper.component.html',
  styleUrls: ['stepper.component.scss'],
})
export class StepperComponent implements OnInit {
  // Employees Data
  employes: Employe[] = [];
  filteredEmployes: Employe[] = [];
  selectedEmploye: Employe | null = null;

  // UI State
  viewMode: 'grid' | 'list' = 'grid';
  searchTerm: string = '';
  sortBy: 'nom' | 'email' | 'role' = 'nom';
  sortOrder: 'asc' | 'desc' = 'asc';
  filterRole: string = 'all';

  // Loading & Pagination
  loading: boolean = false;
  pageSize: number = 12;
  currentPage: number = 1;

  constructor(
    private _router: Router,
    private tokenStorage: TokenStorageService,
    private employeService: EmployeService,
    private toastrService: NbToastrService,
    private excelService: ExcelService,
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  // ==================== DATA LOADING ====================

  loadEmployees(): void {
    this.loading = true;
    this.employeService.getEmployes().subscribe(
      data => {
        this.employes = data || [];
        // Compute stable image URLs for all employees
        this.employes.forEach(emp => {
          const filename = (emp as any).image || (emp as any).imageUrl || (emp as any).imageName || (emp as any).photo;
          (emp as any)._imageUrl = filename
            ? this.employeService.getEmployeeImageUrl(filename)
            : 'assets/default-avatar.png';
        });
        this.applyFilters();
        this.loading = false;
      },
      err => {
        console.error('Error loading employees:', err);
        this.toastrService.danger('Erreur lors du chargement des employés', 'Erreur');
        this.handleAuthError(err);
        this.loading = false;
      },
    );
  }

  // ==================== KPIs ====================

  getTotalEmployees(): number {
    return this.employes.length;
  }

  getActiveEmployees(): number {
    return this.employes.filter(e => e.actif).length;
  }

  getInactiveEmployees(): number {
    return this.employes.filter(e => !e.actif).length;
  }

  getRoleCount(role: string): number {
    return this.employes.filter(e => e.role?.toLowerCase() === role.toLowerCase()).length;
  }

  // ==================== FILTERS & SEARCH ====================

  applyFilters(): void {
    let filtered = [...this.employes];

    // Apply search filter
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        e =>
          e.nom?.toLowerCase().includes(term) ||
          e.prenom?.toLowerCase().includes(term) ||
          e.email?.toLowerCase().includes(term) ||
          e.role?.toLowerCase().includes(term),
      );
    }

    // Apply role filter
    if (this.filterRole && this.filterRole !== 'all') {
      filtered = filtered.filter(e => e.role?.toLowerCase() === this.filterRole.toLowerCase());
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (this.sortBy) {
        case 'nom':
          comparison = (a.nom || '').localeCompare(b.nom || '');
          break;
        case 'email':
          comparison = (a.email || '').localeCompare(b.email || '');
          break;
        case 'role':
          comparison = (a.role || '').localeCompare(b.role || '');
          break;
      }
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    this.filteredEmployes = filtered;
    this.currentPage = 1;
  }

  onSortChange(): void {
    this.applyFilters();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  onRoleFilterChange(): void {
    this.applyFilters();
  }

  // ==================== VIEW CONTROLS ====================

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  viewEmployeeDetails(employe: Employe): void {
    this.selectedEmploye = employe;
  }

  closeDetails(): void {
    this.selectedEmploye = null;
  }

  // ==================== EXPORT ====================

  exportAsXLSX(): void {
    const data = this.filteredEmployes.map(e => ({
      Nom: e.nom,
      Prénom: e.prenom,
      Email: e.email,
      Rôle: e.role,
      Statut: e.actif ? 'Actif' : 'Inactif',
      Direction: e.direction || 'N/A',
    }));

    this.excelService.exportAsExcelFile(data, 'employes');
    this.toastrService.success('Export Excel réussi', 'Succès');
  }

  // ==================== HELPERS ====================

  getDisplayRange(): { start: number; end: number } {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.filteredEmployes.length);
    return { start, end };
  }

  private handleAuthError(err: any): void {
    if (err.status === 401) {
      this._router.navigateByUrl('/auth');
      this.tokenStorage.signOut();
    }
  }

  // ==================== PAGINATION ====================

  get paginatedItems(): Employe[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredEmployes.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredEmployes.length / this.pageSize);
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
}
