import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { SmartTableData } from '../../@core/data/smart-table';
import { Entreprise } from '../../model/entreprise';
import { EntrepriseService } from '../../services/entreprise.service';
import { DirectionService } from '../../services/direction.service';
import { EmployeService } from '../../services/employe.service';
import { AddEntrepriseComponent } from './add-entreprise/add-entreprise.component';
import { UpdateEntrepriseComponent } from './update-entreprise/update-entreprise.component';
import { ExcelService } from '../../services/excel.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-entreprise',
  templateUrl: './entreprise.component.html',
  styleUrls: ['./entreprise.component.scss'],
})
export class EntrepriseComponent implements OnInit {
  public entreprises: Entreprise[] = [];
  public filteredEntreprises: Entreprise[] = [];
  public editEntreprise: Entreprise;
  entreprise: Entreprise;
  searchTerm: string = '';

  constructor(
    private _router: Router,
    private tokenStorage: TokenStorageService,
    private service: SmartTableData,
    private entrepriseService: EntrepriseService,
    private directionService: DirectionService,
    private employeService: EmployeService,
    private dialogService: NbDialogService,
    private excelService: ExcelService,
  ) {}

  ngOnInit() {
    this.getEntreprises();
  }

  /**
   * Charge la liste des entreprises depuis le backend
   */
  public getEntreprises(): void {
    this.entrepriseService.getEntreprises().subscribe(
      (response: Entreprise[]) => {
        this.entreprises = (response || []).map(e => ({ ...e, _expanded: false, _detailsLoaded: false }));
        this.filteredEntreprises = [...this.entreprises];
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        this._router.navigateByUrl('/auth');
        this.tokenStorage.signOut();
      },
    );
  }

  /**
   * Applique le filtre de recherche sur les entreprises
   */
  applySearch(): void {
    const term = (this.searchTerm || '').toLowerCase().trim();
    if (!term) {
      this.filteredEntreprises = [...this.entreprises];
      return;
    }
    this.filteredEntreprises = this.entreprises.filter(
      e => (e.name || '').toLowerCase().includes(term) || (e.raisonSocial || '').toLowerCase().includes(term),
    );
  }

  /**
   * Calcul des KPIs
   */
  getTotalDirections(): number {
    return this.entreprises.reduce((sum, e) => {
      return sum + ((e as any)._details?.directions?.length || 0);
    }, 0);
  }

  getTotalEmployes(): number {
    return this.entreprises.reduce((sum, e) => {
      return sum + ((e as any)._employes?.length || 0);
    }, 0);
  }

  getAverageEmployes(): string {
    if (!this.entreprises || this.entreprises.length === 0) return '0';
    const total = this.getTotalEmployes();
    const loaded = this.entreprises.filter(e => (e as any)._detailsLoaded).length;
    if (loaded === 0) return '-';
    return (total / loaded).toFixed(1);
  }

  /**
   * Bascule l'affichage des détails d'une entreprise (directions et employés)
   */
  toggleDetails(ent: Entreprise): void {
    (ent as any)._expanded = !(ent as any)._expanded;
    if ((ent as any)._expanded && !(ent as any)._detailsLoaded) {
      const id = ent.id;
      this.entrepriseService.getEnrepriseById(id).subscribe(
        full => {
          (ent as any)._employes = (full as any).employes || [];
          // Compute stable image URL for each employee
          for (const emp of (ent as any)._employes) {
            const filename =
              (emp as any).image || (emp as any).imageUrl || (emp as any).imageName || (emp as any).photo;
            (emp as any)._imageUrl = filename
              ? this.employeService.getEmployeeImageUrl(filename)
              : 'assets/images/default-avatar.png';
          }
          this.directionService.getDirectionsNamesByEntreprise(id).subscribe(
            dirs => {
              // Build mapping of direction ID -> employees array
              const map = {} as { [key: number]: any[] };
              for (const d of dirs) {
                map[d.id] = [];
              }
              const emps = (ent as any)._employes || [];
              for (const emp of emps) {
                const dirId = emp.direction && emp.direction.id ? emp.direction.id : emp.direction || null;
                if (dirId && map[dirId]) {
                  map[dirId].push(emp);
                }
              }
              (ent as any)._details = { directions: dirs, map };
              (ent as any)._detailsLoaded = true;
            },
            _err => {
              console.error('Could not load directions for entreprise', _err);
            },
          );
        },
        _err => {
          console.error('Could not load entreprise details', _err);
        },
      );
    }
  }
  /**
   * Confirme et supprime une entreprise
   */
  confirmDelete(entreprise: Entreprise): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'entreprise "${entreprise.name}" ?`)) {
      this.deleteEntr(entreprise.id);
    }
  }

  deleteEntr(id: number): void {
    this.entrepriseService.deleteEntreprise(id).subscribe(
      () => {
        this.getEntreprises();
      },
      _err => {
        this._router.navigateByUrl('/auth');
        this.tokenStorage.signOut();
      },
    );
  }

  /**
   * Ouvre le dialogue d'ajout d'entreprise
   */
  onOpenDialogClick(): void {
    this.dialogService.open(AddEntrepriseComponent).onClose.subscribe(() => {
      this.getEntreprises();
    });
  }

  /**
   * Ouvre le dialogue de modification d'entreprise
   */
  updateEntreprise(idEntreprise: number): void {
    this.entreprise = this.entrepriseService.sendEventData(idEntreprise);
    this.dialogService.open(UpdateEntrepriseComponent).onClose.subscribe(() => {
      this.getEntreprises();
    });
  }

  /**
   * Exporte la liste des entreprises en Excel
   */
  exportAsXLSX(): void {
    const dataToExport = this.filteredEntreprises.map(e => ({
      ID: e.id,
      Nom: e.name,
      'Raison Sociale': e.raisonSocial,
      Directions: (e as any)._details?.directions?.length || '-',
      Employés: (e as any)._employes?.length || '-',
    }));
    this.excelService.exportAsExcelFile(dataToExport, 'entreprises');
  }
}
