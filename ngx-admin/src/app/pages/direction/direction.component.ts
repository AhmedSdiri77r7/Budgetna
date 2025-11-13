import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Router } from '@angular/router';
import { Direction } from '../../model/direction';
import { DirectionService } from '../../services/direction.service';
import { ExcelService } from '../../services/excel.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { AddDirectionComponent } from './add-direction/add-direction.component';
import { UpdateDirectionComponent } from './update-direction/update-direction.component';

@Component({
  selector: 'ngx-direction',
  templateUrl: './direction.component.html',
  styleUrls: ['./direction.component.scss'],
})
export class DirectionComponent implements OnInit {
  listdirections: Direction[] = [];
  directionsByEntreprise: Map<string, Direction[]> = new Map();
  filteredDirectionsByEntreprise: Map<string, Direction[]> = new Map();
  search: string = '';
  budgetFilter: string = 'all';
  direction: Direction;

  constructor(
    private _router: Router,
    private tokenStorage: TokenStorageService,
    private serviceDirection: DirectionService,
    private dialogService: NbDialogService,
    private excelService: ExcelService,
  ) {}

  ngOnInit(): void {
    this.serviceDirection.getDirections().subscribe(
      data => {
        this.listdirections = data;
        this.regroupDirections(data);
        this.applyFilters();
      },
      _err => {
        this._router.navigateByUrl('/auth');
        this.tokenStorage.signOut();
      },
    );
  }

  /**
   * Calcul des KPIs
   */
  getDirectionsWithBudgetInitial(): number {
    return this.listdirections.filter(d => this.hasBudgetInitial(d)).length;
  }

  getDirectionsWithBudgetRevise(): number {
    return this.listdirections.filter(d => this.hasBudgetRevise(d)).length;
  }

  hasBudgetInitial(direction: Direction): boolean {
    return direction.budgetInitial != null;
  }

  hasBudgetRevise(direction: Direction): boolean {
    return direction.budgetRevise != null;
  }

  getBudgetInitialTotal(direction: Direction): number {
    return direction.budgetInitial?.tauxBudget || 0;
  }

  getBudgetReviseTotal(direction: Direction): number {
    return direction.budgetRevise?.tauxBudget || 0;
  }
  /**
   * Ouvre le dialogue d'ajout de direction
   */
  onOpenDialogClick(): void {
    this.dialogService.open(AddDirectionComponent).onClose.subscribe(() => {
      this.refreshDirections();
    });
  }

  /**
   * Confirme et supprime une direction
   */
  confirmDelete(direction: Direction): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la direction "${direction.name}" ?`)) {
      this.deleteDirection(direction.id);
    }
  }

  deleteDirection(id: number): void {
    this.serviceDirection.deleteDirection(id).subscribe(
      () => {
        this.refreshDirections();
      },
      _err => {
        this._router.navigateByUrl('/auth');
        this.tokenStorage.signOut();
      },
    );
  }

  refreshDirections(): void {
    this.serviceDirection.getDirections().subscribe(data => {
      this.listdirections = data;
      this.regroupDirections(data);
      this.applyFilters();
    });
  }
  /**
   * Recherche dans les directions
   */
  searchfct(): void {
    if (!this.search) {
      this.regroupDirections(this.listdirections);
      this.applyFilters();
      return;
    }

    const searchTerm = this.search.toLowerCase();
    const filteredDirections = this.listdirections.filter(
      direction =>
        direction.name.toLowerCase().includes(searchTerm) ||
        direction.entreprise?.name.toLowerCase().includes(searchTerm),
    );

    this.regroupDirections(filteredDirections);
    this.applyFilters();
  }

  /**
   * Applique les filtres de budget
   */
  applyFilters(): void {
    this.filteredDirectionsByEntreprise.clear();

    this.directionsByEntreprise.forEach((directions, entrepriseName) => {
      let filtered = directions;

      // Filter by budget status
      if (this.budgetFilter !== 'all') {
        filtered = directions.filter(d => {
          const hasInitial = this.hasBudgetInitial(d);
          const hasRevise = this.hasBudgetRevise(d);

          switch (this.budgetFilter) {
            case 'both':
              return hasInitial && hasRevise;
            case 'initial':
              return hasInitial && !hasRevise;
            case 'revise':
              return !hasInitial && hasRevise;
            case 'none':
              return !hasInitial && !hasRevise;
            default:
              return true;
          }
        });
      }

      if (filtered.length > 0) {
        this.filteredDirectionsByEntreprise.set(entrepriseName, filtered);
      }
    });
  }

  /**
   * Regroupe les directions par entreprise
   */
  private regroupDirections(directions: Direction[]): void {
    this.directionsByEntreprise.clear();
    directions.forEach(direction => {
      const entrepriseName = direction.entreprise?.name || 'Sans entreprise';
      if (!this.directionsByEntreprise.has(entrepriseName)) {
        this.directionsByEntreprise.set(entrepriseName, []);
      }
      this.directionsByEntreprise.get(entrepriseName).push(direction);
    });
  }

  /**
   * Met à jour une direction
   */
  updateDirection(id: number): void {
    this.direction = this.serviceDirection.sendEventData(id);
    this.dialogService.open(UpdateDirectionComponent).onClose.subscribe(() => {
      this.refreshDirections();
    });
  }
  /**
   * Exporte les directions en CSV
   */
  exportAsXLSX(): void {
    const dataToExport = this.listdirections.map(d => ({
      ID: d.id,
      Nom: d.name,
      Entreprise: d.entreprise?.name || 'Sans entreprise',
      'Budget Initial': this.getBudgetInitialTotal(d),
      'Budget Révisé': this.getBudgetReviseTotal(d),
      'Statut Budget':
        this.hasBudgetInitial(d) && this.hasBudgetRevise(d)
          ? 'Complet'
          : this.hasBudgetInitial(d)
            ? 'Initial'
            : this.hasBudgetRevise(d)
              ? 'Révisé'
              : 'Aucun',
    }));
    this.downloadFile(dataToExport, 'directions');
  }

  downloadFile(data: any[], filename: string = 'data'): void {
    const csvData = this.ConvertToCSV(data);
    const blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    const dwldLink = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const isSafariBrowser =
      navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;
    if (isSafariBrowser) {
      dwldLink.setAttribute('target', '_blank');
    }
    dwldLink.setAttribute('href', url);
    dwldLink.setAttribute('download', filename + '.csv');
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  ConvertToCSV(objArray: any[]): string {
    if (objArray.length === 0) return '';
    const keys = Object.keys(objArray[0]);
    let str = keys.join(',') + '\r\n';
    objArray.forEach(obj => {
      const row = keys.map(key => obj[key] || '').join(',');
      str += row + '\r\n';
    });
    return str;
  }
}
