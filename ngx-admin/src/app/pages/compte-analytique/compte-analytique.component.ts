import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';

import { DirectionService } from '../../services/direction.service';
import { ExcelService } from '../../services/excel.service';
import { TokenStorageService } from '../../services/token-storage.service';

import { Direction } from '../../model/direction';
import { AddCompteAnalytiqueComponent } from './add-compte-analytique/add-compte-analytique.component';
import { UpdateCompteAnalytiqueComponent } from './update-compte-analytique/update-compte-analytique.component';
import { BudgetReviseComponent } from './budget-revise/budget-revise.component';

@Component({
  selector: 'ngx-compte-analytique',
  templateUrl: './compte-analytique.component.html',
  styleUrls: ['./compte-analytique.component.scss'],
})
export class CompteAnalytiqueComponent implements OnInit {
  selectedDirection: number;
  listdirections: Direction[] = [];
  filteredDirections: Direction[] = [];
  paginatedDirections: Direction[] = [];

  search = '';
  filterEntreprise = 'all';
  filterBudget = 'all';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  Math = Math;

  // Tri
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  direction: Direction;

  constructor(
    private _router: Router,
    private tokenStorage: TokenStorageService,
    private serviceDirection: DirectionService,
    private matDialog: MatDialog,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private excelService: ExcelService,
  ) {}

  ngOnInit(): void {
    this.loadDirections();
  }

  /**
   * Charger toutes les directions
   */
  loadDirections(): void {
    this.serviceDirection.getDirections().subscribe(
      data => {
        this.listdirections = data;
        this.applyFilters();
      },
      error => {
        console.error('Erreur lors du chargement des directions:', error);
        this.toastrService.danger('Impossible de charger les directions', 'Erreur');
      },
    );
  }

  /**
   * Appliquer les filtres
   */
  applyFilters(): void {
    let filtered = [...this.listdirections];

    // Filtre recherche
    if (this.search) {
      const searchLower = this.search.toLowerCase();
      filtered = filtered.filter(
        d =>
          d.name?.toLowerCase().includes(searchLower) ||
          d.entreprise?.name?.toLowerCase().includes(searchLower) ||
          d.budgetInitial?.tauxBudget?.toString().includes(searchLower) ||
          d.budgetRevise?.tauxBudget?.toString().includes(searchLower),
      );
    }

    // Filtre entreprise
    if (this.filterEntreprise && this.filterEntreprise !== 'all') {
      filtered = filtered.filter(d => d.entreprise?.name === this.filterEntreprise);
    }

    // Filtre budget
    if (this.filterBudget && this.filterBudget !== 'all') {
      switch (this.filterBudget) {
        case 'initial':
          filtered = filtered.filter(d => d.budgetInitial != null);
          break;
        case 'revise':
          filtered = filtered.filter(d => d.budgetRevise != null);
          break;
        case 'both':
          filtered = filtered.filter(d => d.budgetInitial != null && d.budgetRevise != null);
          break;
      }
    }

    this.filteredDirections = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  /**
   * Réinitialiser les filtres
   */
  resetFilters(): void {
    this.search = '';
    this.filterEntreprise = 'all';
    this.filterBudget = 'all';
    this.applyFilters();
    this.toastrService.info('Filtres réinitialisés', 'Info');
  }

  /**
   * Trier les données
   */
  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredDirections.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (column) {
        case 'id':
          valueA = a.id;
          valueB = b.id;
          break;
        case 'name':
          valueA = a.name?.toLowerCase() || '';
          valueB = b.name?.toLowerCase() || '';
          break;
        case 'budgetInitial':
          valueA = a.budgetInitial?.tauxBudget || 0;
          valueB = b.budgetInitial?.tauxBudget || 0;
          break;
        case 'budgetRevise':
          valueA = a.budgetRevise?.tauxBudget || 0;
          valueB = b.budgetRevise?.tauxBudget || 0;
          break;
        default:
          return 0;
      }

      const comparison = valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    this.updatePagination();
  }

  /**
   * Obtenir l'icône de tri
   */
  getSortIcon(column: string): string {
    if (this.sortColumn !== column) {
      return 'swap-outline';
    }
    return this.sortDirection === 'asc' ? 'arrow-up-outline' : 'arrow-down-outline';
  }

  /**
   * Mise à jour de la pagination
   */
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredDirections.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedDirections = this.filteredDirections.slice(start, end);
  }

  /**
   * Page précédente
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  /**
   * Page suivante
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  /**
   * KPIs - Directions avec budget initial
   */
  getDirectionsWithBudgetInitial(): number {
    return this.listdirections.filter(d => d.budgetInitial != null).length;
  }

  /**
   * KPIs - Directions avec budget révisé
   */
  getDirectionsWithBudgetRevise(): number {
    return this.listdirections.filter(d => d.budgetRevise != null).length;
  }

  /**
   * KPIs - Budget total
   */
  getTotalBudget(): number {
    return this.listdirections.reduce((sum, d) => {
      const initial = d.budgetInitial?.tauxBudget || 0;
      const revise = d.budgetRevise?.tauxBudget || 0;
      return sum + Math.max(initial, revise);
    }, 0);
  }

  /**
   * Obtenir les entreprises uniques pour le filtre
   */
  getUniqueEntreprises(): string[] {
    const entreprises = this.listdirections.map(d => d.entreprise?.name).filter(name => name != null);
    return [...new Set(entreprises)];
  }

  /**
   * Obtenir le statut d'une direction
   */
  getDirectionStatus(direction: Direction): string {
    if (direction.budgetInitial && direction.budgetRevise) {
      return 'Complet';
    } else if (direction.budgetInitial || direction.budgetRevise) {
      return 'Partiel';
    } else {
      return 'Aucun';
    }
  }

  /**
   * Obtenir le badge de statut
   */
  getDirectionStatusBadge(direction: Direction): string {
    if (direction.budgetInitial && direction.budgetRevise) {
      return 'success';
    } else if (direction.budgetInitial || direction.budgetRevise) {
      return 'warning';
    } else {
      return 'basic';
    }
  }

  getBudgetInitialTaux(direction: Direction): string {
    return direction?.budgetInitial?.tauxBudget?.toString() || '-';
  }

  getBudgetReviseTaux(direction: Direction): string {
    return direction?.budgetRevise?.tauxBudget?.toString() || '-';
  }

  /**
   * Ouvrir le dialog d'affectation de budget
   */
  onOpenDialogClick(): void {
    this.matDialog
      .open(AddCompteAnalytiqueComponent, {
        width: '600px',
      })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.loadDirections();
        }
      });
  }

  /**
   * Ouvrir le dialog d'ajout de budget révisé
   */
  onOpenDialogClick1(): void {
    this.matDialog
      .open(BudgetReviseComponent, {
        width: '600px',
      })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.loadDirections();
        }
      });
  }

  /**
   * Mettre à jour une direction
   */
  updateDirection(id: number): void {
    this.direction = this.serviceDirection.sendEventData(id);
    this.matDialog
      .open(UpdateCompteAnalytiqueComponent, {
        width: '600px',
      })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.loadDirections();
        }
      });
  }

  /**
   * Voir les détails
   */
  viewDetails(direction: Direction): void {
    const message = `
      <strong>Direction:</strong> ${direction.name}<br>
      <strong>Entreprise:</strong> ${direction.entreprise?.name || '-'}<br>
      <strong>Budget Initial:</strong> ${this.getBudgetInitialTaux(direction)} €<br>
      <strong>Budget Révisé:</strong> ${this.getBudgetReviseTaux(direction)} €<br>
      <strong>Statut:</strong> ${this.getDirectionStatus(direction)}
    `;

    this.toastrService.info(message, `Détails - ${direction.name}`, {
      duration: 5000,
      hasIcon: true,
    });
  }

  /**
   * Exporter vers Excel
   */
  exportAsXLSX(): void {
    const data = this.filteredDirections.map(d => ({
      ID: d.id,
      Direction: d.name,
      Entreprise: d.entreprise?.name || '-',
      'Budget Initial': this.getBudgetInitialTaux(d),
      'Budget Révisé': this.getBudgetReviseTaux(d),
      Statut: this.getDirectionStatus(d),
    }));

    this.excelService.exportAsExcelFile(data, 'comptes_analytiques');
    this.toastrService.success('Export Excel réussi', 'Succès');
  }
}
