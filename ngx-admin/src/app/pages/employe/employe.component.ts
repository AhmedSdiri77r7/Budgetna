import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Employe } from '../../model/employe';
import { EmployeService } from '../../services/employe.service';
import { ExcelService } from '../../services/excel.service';
import { AddEmployeComponent } from './add-employe/add-employe.component';
import { UpdateEmployeComponent } from './update-employe/update-employe.component';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar

@Component({
  selector: 'ngx-employe',
  templateUrl: './employe.component.html',
  styleUrls: ['./employe.component.scss']
})
export class EmployeComponent implements OnInit {
  listemploye: Employe[] = [];
  employe: Employe;

  constructor(
    private employeService: EmployeService,
    private matDialog: MatDialog,
    private excelService: ExcelService,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  // Ouvre la fenêtre pour ajouter un employé
  onOpenDialogClick(): void {
    this.matDialog.open(AddEmployeComponent);
  }

  // Récupérer la liste des employés
  public getUsers(): void {
    this.employeService.getEmployes().subscribe((data: Employe[]) => {
      this.listemploye = data;
      console.log('Liste des employés:', data);
    }, (error: HttpErrorResponse) => {
      console.error('Erreur lors du chargement des employés:', error);
      this.snackBar.open('Erreur lors du chargement des employés', 'Fermer', {
        duration: 3000,
      });
    });
  }

  // Supprimer un employé
  deleteEmploye(id: number): void {
    this.employeService.deleteEmploye(id).subscribe(() => {
      this.getUsers(); // Recharge la liste des employés après suppression
      console.log('Employé supprimé avec succès');
      this.snackBar.open('Employé supprimé avec succès', 'Fermer', {
        duration: 3000,
      });
    }, (error: HttpErrorResponse) => {
      console.error('Erreur lors de la suppression de l\'employé:', error);
      this.snackBar.open('Erreur lors de la suppression de l\'employé', 'Fermer', {
        duration: 3000,
      });
    });
  }

  // Mettre à jour un employé
  updateEmploye(id: number): void {
    this.employeService.sendEventData(id);  // Envoie l'ID à UpdateEmployeComponent
    this.matDialog.open(UpdateEmployeComponent);
  }

  // Gestion de l'upload d'image
  onImageSelected(event: any, employeId: number): void {
    const file = event.target.files[0];
    if (file) {
      this.employeService.uploadImage(file, employeId).subscribe({
        next: () => {
          console.log('Image téléchargée avec succès');
          this.getUsers(); // Rafraîchir la liste des employés après l'upload
          this.snackBar.open('Image téléchargée avec succès', 'Fermer', {
            duration: 3000,
          });
        },
        error: (err) => {
          console.error('Erreur lors de l\'upload de l\'image:', err);
          this.snackBar.open('Erreur lors de l\'upload de l\'image', 'Fermer', {
            duration: 3000,
          });
        }
      });
    }
  }
  getImageUrl(imageName: string): string {
    return `http://localhost:8081/employe/image/${imageName}`;
  }
  
  // Exporter les employés en format Excel
  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.listemploye, 'listemploye');
  }
}
