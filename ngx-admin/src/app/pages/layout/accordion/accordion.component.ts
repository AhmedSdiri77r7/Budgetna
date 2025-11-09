import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BudgetService } from '../../../services/budget.service';
import { EmployeService } from '../../../services/employe.service';
import { TokenStorageService } from '../../../services/token-storage.service';
import { Budget } from '../../../model/Budget';
import { Employe } from '../../../model/employe';
import { BudgetWithEmploye } from './budget-with-employe.interface';
import { AuthService } from '../../../services/auth.service';
import { BudgetInitial } from '../../../model/budgetInitial';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource } from '@nebular/theme';
import { ExcelService } from '../../../services/excel.service';
import { debounceTime } from 'rxjs/operators';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { BudgetDetailsComponent } from './budget-details/budget-details.component';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { BudgetStateService } from '../../../services/budget-state.service';

@Component({
  selector: 'ngx-accordion',
  templateUrl: 'accordion.component.html',
  styleUrls: ['accordion.component.scss'],
})
export class AccordionComponent implements OnInit {
  budgets: BudgetWithEmploye[] = [];
  listemploye: Employe[];
  employe: Employe;
  validationMessage: string | null = null;
  validationStatus: 'success' | 'danger' = 'success';
  budgetInitiaux: BudgetInitial[] = [];
  loading = false;

  // Tableau des validations
  validations: BudgetWithEmploye[] = [];
  sortColumn: string = '';
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  // Colonnes du tableau
  columns = ['budgetInitial', 'employe', 'libelle', 'dateDebut', 'dateFin', 'statut'];

  // Filtres
  searchForm = new FormGroup({
    searchEmploye: new FormControl(''),
    searchDateDebut: new FormControl(''),
    searchDateFin: new FormControl(''),
    searchStatut: new FormControl(''),
  });

  budgetForm = new FormGroup({
    idBudgetInitial: new FormControl('', [Validators.required]),
    idEmploye: new FormControl('', [Validators.required]),
    libelle: new FormControl('', [Validators.required, Validators.minLength(3)]),
    dateDebut: new FormControl('', [Validators.required]),
    dateFin: new FormControl('', [Validators.required]),
  });

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private budgetService: BudgetService,
    private employeService: EmployeService,
    private authService: AuthService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private excelService: ExcelService,
    private budgetStateService: BudgetStateService,
  ) {
    this.searchForm.valueChanges.pipe(debounceTime(300)).subscribe(() => this.applyFilters());

    // Souscription aux changements dans le service d'état
    this.budgetStateService.budgets$.subscribe(budgets => {
      this.budgets = budgets;
      this.validations = budgets;
      this.applyFilters();
    });
  }

  @ViewChild('item', { static: true }) accordion;

  async showDetails(budget: Budget): Promise<void> {
    try {
      const employeInfo = await this.getEmployeInfo(budget.employe);

      // Déterminer si l'utilisateur est un chef de département
      const isChefDepartement = this.authService.isChefDepartement();

      // Si le budget n'est pas validé et que l'utilisateur est chef de département,
      // ouvrir en mode validation, sinon en mode vue
      const mode = !budget.iSvalide && isChefDepartement ? 'validate' : 'view';

      this.dialogService.open(BudgetDetailsComponent, {
        context: {
          budget: budget,
          employeInfo: employeInfo,
          mode: mode,
          budgetInitiaux: this.budgetInitiaux,
        },
        dialogClass: 'budget-details-dialog',
      });
    } catch (error) {
      this.toastrService.danger('Erreur lors du chargement des détails', 'Erreur');
    }
  }

  async openValidationDialog(budget: Budget): Promise<void> {
    try {
      // Vérifier si le budget est déjà validé
      if (budget.iSvalide) {
        this.toastrService.warning('Ce budget est déjà validé', 'Information');
        return;
      }

      const employeInfo = await this.getEmployeInfo(budget.employe);

      this.dialogService
        .open(BudgetDetailsComponent, {
          context: {
            budget: budget,
            employeInfo: employeInfo,
            mode: 'validate',
            budgetInitiaux: this.budgetInitiaux,
          },
          dialogClass: 'budget-details-dialog',
        })
        .onClose.subscribe(result => {
          if (result) {
            // Recharger les validations après une validation réussie
            this.loadValidations();
          }
        });
    } catch (error) {
      this.toastrService.danger('Erreur lors du chargement du formulaire de validation', 'Erreur');
    }
  }

  openAddBudget(): void {
    this.dialogService
      .open(BudgetDetailsComponent, {
        context: {
          mode: 'add',
          budgetInitiaux: this.budgetInitiaux,
        },
        dialogClass: 'budget-details-dialog',
      })
      .onClose.subscribe(result => {
        if (result) {
          this.loadValidations();
        }
      });
  }

  async deleteBudget(budget: Budget): Promise<void> {
    if (budget.iSvalide) {
      this.toastrService.warning('Impossible de supprimer un budget déjà validé', 'Action non autorisée');
      return;
    }

    this.dialogService
      .open(ConfirmationDialogComponent, {
        context: {
          title: 'Confirmation de suppression',
          message: 'Êtes-vous sûr de vouloir supprimer ce budget ?',
        },
      })
      .onClose.subscribe(result => {
        if (result === true) {
          this.budgetService.deleteBudget(budget.budgetPK.idEmploye.toString()).subscribe(
            () => {
              this.toastrService.success('Le budget a été supprimé avec succès', 'Succès');
              // Mettre à jour l'état global
              this.budgetStateService.removeBudget(budget.budgetPK.idEmploye.toString());
            },
            error => {
              this.toastrService.danger('Une erreur est survenue lors de la suppression', 'Erreur');
            },
          );
        }
      });
  }

  async getEmployeInfo(idEmploye: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.employeService.findById(idEmploye).subscribe(
        employe => resolve(employe),
        error => reject(error),
      );
    });
  }

  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column;
    this.sortDirection =
      sortRequest.direction === NbSortDirection.ASCENDING ? NbSortDirection.ASCENDING : NbSortDirection.DESCENDING;
    this.applyFilters();
  }

  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }

  async exportToExcel(): Promise<void> {
    try {
      const exportData = await Promise.all(
        this.validations.map(async validation => {
          const employe = await this.getEmployeInfo(validation.employe);
          return {
            'Budget Initial': validation.budgetInitial?.name || '',
            Employé: `${employe.prenom || ''} ${employe.nom || ''}`,
            Libellé: validation.budgetPK?.libelle || '',
            'Date Début': validation.budgetPK?.dateDebut
              ? new Date(validation.budgetPK.dateDebut).toLocaleDateString()
              : '',
            'Date Fin': validation.budgetPK?.dateFin ? new Date(validation.budgetPK.dateFin).toLocaleDateString() : '',
            Statut: validation.iSvalide ? 'Validé' : 'En attente',
          };
        }),
      );

      this.excelService.exportAsExcelFile(exportData, 'validations_budget');
      this.toastrService.success('Le fichier a été exporté avec succès', 'Export Excel');
    } catch (error) {
      this.toastrService.danger("Une erreur est survenue lors de l'export", 'Erreur');
    }
  }

  async applyFilters(): Promise<void> {
    let filteredValidations = [...this.budgets];
    const { searchEmploye, searchDateDebut, searchDateFin, searchStatut } = this.searchForm.value;

    // Charger les informations des employés pour tous les budgets
    const budgetsWithEmployeInfo = await Promise.all(
      filteredValidations.map(async budget => {
        const employeInfo = await this.getEmployeInfo(budget.employe);
        return {
          ...budget,
          employeInfo: employeInfo,
        };
      }),
    );
    filteredValidations = budgetsWithEmployeInfo;

    if (searchEmploye) {
      const search = searchEmploye.toLowerCase();
      filteredValidations = filteredValidations.filter(
        v => v.employeInfo.nom?.toLowerCase().includes(search) || v.employeInfo.prenom?.toLowerCase().includes(search),
      );
    }

    if (searchDateDebut) {
      const debut = new Date(searchDateDebut);
      filteredValidations = filteredValidations.filter(v =>
        v.budgetPK?.dateDebut ? new Date(v.budgetPK.dateDebut) >= debut : false,
      );
    }

    if (searchDateFin) {
      const fin = new Date(searchDateFin);
      filteredValidations = filteredValidations.filter(v =>
        v.budgetPK?.dateFin ? new Date(v.budgetPK.dateFin) <= fin : false,
      );
    }

    if (searchStatut !== '') {
      filteredValidations = filteredValidations.filter(v => v.iSvalide === (searchStatut === 'true'));
    }

    // Tri par défaut par nom d'employé si aucune colonne n'est sélectionnée
    if (!this.sortColumn) {
      this.sortColumn = 'employe';
      this.sortDirection = NbSortDirection.ASCENDING;
    }

    // Tri des validations
    filteredValidations.sort((a, b) => {
      const dir = this.sortDirection === NbSortDirection.ASCENDING ? 1 : -1;
      let valueA: any;
      let valueB: any;

      switch (this.sortColumn) {
        case 'employe':
          // Tri par nom puis prénom
          valueA = `${a.employeInfo.nom} ${a.employeInfo.prenom}`.toLowerCase();
          valueB = `${b.employeInfo.nom} ${b.employeInfo.prenom}`.toLowerCase();
          break;
        case 'budgetInitial':
          valueA = a.budgetInitial?.name;
          valueB = b.budgetInitial?.name;
          break;
        case 'dateDebut':
          valueA = new Date(a.budgetPK?.dateDebut || 0);
          valueB = new Date(b.budgetPK?.dateDebut || 0);
          break;
        case 'dateFin':
          valueA = new Date(a.budgetPK?.dateFin || 0);
          valueB = new Date(b.budgetPK?.dateFin || 0);
          break;
        case 'statut':
          valueA = a.iSvalide ? 1 : 0;
          valueB = b.iSvalide ? 1 : 0;
          break;
        default:
          valueA = a[this.sortColumn];
          valueB = b[this.sortColumn];
      }

      if (!valueA) return 1;
      if (!valueB) return -1;
      return valueA > valueB ? dir : valueA < valueB ? -dir : 0;
    });

    this.validations = filteredValidations;
  }

  ngOnInit(): void {
    this.getInitialBudgets();
    this.getUsers();
    this.loadValidations();
  }

  async loadValidations(): Promise<void> {
    try {
      const loggedInEmployeeId = this.authService.getLoggedInEmployeeId();
      if (!loggedInEmployeeId) {
        this.toastrService.danger("Vous devez être connecté pour voir l'historique des budgets.", 'Erreur');
        return;
      }

      this.loading = true;
      const budgets = await this.budgetService.findAllBudgetByEmployeJPQL(loggedInEmployeeId).toPromise();

      // Mettre à jour l'état global
      this.budgetStateService.updateBudgets(budgets);

      // Les données seront automatiquement mises à jour via la souscription dans le constructeur
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.toastrService.danger("Erreur lors du chargement de l'historique des budgets", 'Erreur');
      console.error('Erreur lors du chargement des budgets:', error);
    }
  }
  getInitialBudgets(): void {
    this.budgetService.getBudgetInitial().subscribe(
      (data: BudgetInitial[]) => {
        this.budgetInitiaux = data;
      },
      error => {
        console.error(error);
      },
    );
  }

  getUsers(): void {
    this.employeService.getEmployes().subscribe(
      (data: Employe[]) => {
        this.listemploye = data;
        console.log(data);
      },
      error => {
        console.error(error);
        this.router.navigateByUrl('/auth');
        this.tokenStorage.signOut();
      },
    );
  }

  // Fonction utilitaire pour formater les dates
  private formatDateForBackend(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit(): void {
    if (this.budgetForm.invalid) {
      this.toastrService.danger('Veuillez remplir tous les champs requis.', 'Erreur');
      return;
    }

    this.loading = true;
    const { idBudgetInitial, idEmploye, libelle, dateDebut, dateFin } = this.budgetForm.value;
    const loggedInEmployeeId = this.authService.getLoggedInEmployeeId();

    if (!loggedInEmployeeId) {
      this.toastrService.danger('Vous devez être connecté pour valider un budget.', 'Erreur');
      this.loading = false;
      return;
    }

    // Formatage des dates
    const formattedDateDebut = this.formatDateForBackend(dateDebut);
    const formattedDateFin = this.formatDateForBackend(dateFin);

    // Vérification des dates
    if (new Date(formattedDateDebut) > new Date(formattedDateFin)) {
      this.toastrService.danger('La date de début doit être antérieure à la date de fin.', 'Erreur');
      this.loading = false;
      return;
    }

    this.dialogService
      .open(ConfirmationDialogComponent, {
        context: {
          title: 'Confirmation de validation',
          message: 'Êtes-vous sûr de vouloir valider ce budget ?',
        },
      })
      .onClose.subscribe(result => {
        if (result === true) {
          // Format the dates properly
          const formattedDateDebut = new Date(dateDebut).toISOString().split('T')[0];
          const formattedDateFin = new Date(dateFin).toISOString().split('T')[0];

          // S'assurer que toutes les valeurs sont du bon type
          // Log des données avant l'envoi
          console.log('Données de validation:', {
            idBudgetInitial: Number(idBudgetInitial),
            idEmploye: Number(idEmploye),
            libelle,
            dateDebut: formattedDateDebut,
            dateFin: formattedDateFin,
            validateur: Number(loggedInEmployeeId),
          });

          this.budgetService
            .validerBudget(
              Number(idBudgetInitial),
              Number(idEmploye),
              libelle,
              formattedDateDebut,
              formattedDateFin,
              Number(loggedInEmployeeId),
            )
            .subscribe(
              () => {
                this.validationStatus = 'success';
                this.validationMessage = 'Budget validé avec succès !';
                this.toastrService.success('Le budget a été validé avec succès.', 'Succès');
                this.budgetForm.reset();
                this.loading = false;
                // Recharger les validations après succès
                this.loadValidations();
              },
              error => {
                this.validationStatus = 'danger';
                this.validationMessage = 'Erreur lors de la validation du budget.';
                console.error("Détails de l'erreur:", error);

                // Message d'erreur plus détaillé
                let errorMessage = "Une erreur s'est produite lors de la validation.";
                if (error.error && error.error.message) {
                  errorMessage = error.error.message;
                } else if (error.status === 403) {
                  errorMessage = "Vous n'avez pas les droits nécessaires pour effectuer cette action.";
                } else if (error.status === 400) {
                  errorMessage = 'Les données soumises sont invalides. Veuillez vérifier les informations saisies.';
                }

                this.toastrService.danger(errorMessage, 'Erreur');
                this.loading = false;
                console.error(error);
              },
            );
        }
      });
  }
}
