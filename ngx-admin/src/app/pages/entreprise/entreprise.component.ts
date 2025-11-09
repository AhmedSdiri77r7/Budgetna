import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { MatDialog } from '@angular/material/dialog';
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
  public entreprises: Entreprise[];
  public editEntreprise: Entreprise;
  entreprise: Entreprise;
  // public deleteEntreprise: Entreprise;

  constructor(
    private _router: Router,
    private tokenStorage: TokenStorageService,
    private service: SmartTableData,
    private entrepriseService: EntrepriseService,
    private directionService: DirectionService,
    private employeService: EmployeService,
    private matDialog: MatDialog,
    private excelService: ExcelService,
  ) {}

  ngOnInit() {
    this.getEntreprises();
    console.log('hello');
  }
  public getEntreprises(): void {
    this.entrepriseService.getEntreprises().subscribe(
      (response: Entreprise[]) => {
        // store entreprises and ensure small UI helpers
        this.entreprises = (response || []).map(e => ({ ...e, _expanded: false, _detailsLoaded: false }));
        console.log(this.entreprises);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        this._router.navigateByUrl('/auth');
        this.tokenStorage.signOut();
      },
    );
  }

  // Toggle details panel for an entreprise: load directions and employes if needed
  toggleDetails(ent: Entreprise) {
    (ent as any)._expanded = !(ent as any)._expanded;
    if ((ent as any)._expanded && !(ent as any)._detailsLoaded) {
      const id = ent.id;
      // load entreprise full data (to get employes) and directions for this entreprise
      this.entrepriseService.getEnrepriseById(id).subscribe(
        full => {
          (ent as any)._employes = (full as any).employes || [];
          // compute stable image URL for each employee if possible
          for (const emp of (ent as any)._employes) {
            const filename =
              (emp as any).image || (emp as any).imageUrl || (emp as any).imageName || (emp as any).photo;
            (emp as any)._imageUrl = filename
              ? this.employeService.getEmployeeImageUrl(filename)
              : 'assets/default-avatar.png';
          }
          this.directionService.getDirectionsNamesByEntreprise(id).subscribe(
            dirs => {
              // build mapping of direction -> employees
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
            err => {
              console.error('Could not load directions for entreprise', err);
            },
          );
        },
        err => {
          console.error('Could not load entreprise details', err);
        },
      );
    }
  }
  deleteEntr(id: number): void {
    this.entrepriseService.deleteEntreprise(id).subscribe(
      () => {
        this.entrepriseService.getEntreprises().subscribe(
          data => (this.entreprises = data),
          err => {
            this._router.navigateByUrl('/auth');
            this.tokenStorage.signOut();
          },
        );
      },
      err => {
        this._router.navigateByUrl('/auth');
        this.tokenStorage.signOut();
      },
    );
  }
  onOpenDialogClick() {
    this.matDialog.open(AddEntrepriseComponent);
  }
  updateEntreprise(idEntreprise: number) {
    this.entreprise = this.entrepriseService.sendEventData(idEntreprise);
    this.matDialog.open(UpdateEntrepriseComponent);
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.entreprises, 'listentreprise');
  }

  // add loaded class to image to trigger fade-in
  onAvatarLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img && img.classList) img.classList.add('loaded');
  }
}
