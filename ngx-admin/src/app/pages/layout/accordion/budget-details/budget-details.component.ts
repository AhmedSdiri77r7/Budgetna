import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { Budget } from '../../../../model/Budget';
import { BudgetInitial } from '../../../../model/budgetInitial';
import { BudgetService } from '../../../../services/budget.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'ngx-budget-details',
  template: `
    <nb-card>
      <nb-card-header class="d-flex justify-content-between align-items-center">
        <h5>{{ getHeaderText() }}</h5>
        <button nbButton ghost (click)="close()">
          <nb-icon icon="close-outline"></nb-icon>
        </button>
      </nb-card-header>
      <nb-card-body>
        <!-- Mode vue -->
        <div class="details-container" *ngIf="mode === 'view'">
          <div class="detail-group">
            <label class="label">Budget Initial</label>
            <p>{{ budget?.budgetInitial?.name || 'Non défini' }}</p>
            <p>Taux: {{ budget?.budgetInitial?.tauxBudget | currency: 'EUR' }}</p>
          </div>

          <div class="detail-group">
            <label class="label">Information Budget</label>
            <p>Libellé: {{ budget?.budgetPK?.libelle }}</p>
            <p>Date Début: {{ budget?.budgetPK?.dateDebut | date: 'dd/MM/yyyy' }}</p>
            <p>Date Fin: {{ budget?.budgetPK?.dateFin | date: 'dd/MM/yyyy' }}</p>
          </div>

          <div class="detail-group">
            <label class="label">Statut</label>
            <nb-badge
              [text]="budget?.iSvalide ? 'Validé' : 'En attente'"
              [status]="budget?.iSvalide ? 'success' : 'warning'"
            >
            </nb-badge>
          </div>

          <div class="detail-group" *ngIf="employeInfo">
            <label class="label">Employé</label>
            <p>Nom: {{ employeInfo?.nom }}</p>
            <p>Prénom: {{ employeInfo?.prenom }}</p>
            <p>Email: {{ employeInfo?.email }}</p>
          </div>
        </div>

        <!-- Mode ajout ou validation -->
        <form
          [formGroup]="budgetForm"
          (ngSubmit)="onSubmit()"
          *ngIf="mode === 'add' || mode === 'validate'"
          class="budget-form"
        >
          <div class="form-group">
            <label for="idBudgetInitial" class="label">Budget Initial</label>
            <nb-select
              fullWidth
              id="idBudgetInitial"
              formControlName="idBudgetInitial"
              placeholder="Sélectionner un budget initial"
              [disabled]="mode === 'validate'"
            >
              <nb-option *ngFor="let bi of budgetInitiaux" [value]="bi.id">
                {{ bi.name }} - {{ bi.tauxBudget | currency: 'EUR' }}
              </nb-option>
            </nb-select>
          </div>

          <div class="form-group">
            <label for="libelle" class="label">Libellé</label>
            <input
              nbInput
              fullWidth
              id="libelle"
              formControlName="libelle"
              placeholder="Entrez le libellé"
              [readonly]="mode === 'validate'"
            />
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="dateDebut" class="label">Date de début</label>
                <input
                  nbInput
                  fullWidth
                  type="date"
                  id="dateDebut"
                  formControlName="dateDebut"
                  [readonly]="mode === 'validate'"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="dateFin" class="label">Date de fin</label>
                <input
                  nbInput
                  fullWidth
                  type="date"
                  id="dateFin"
                  formControlName="dateFin"
                  [readonly]="mode === 'validate'"
                />
              </div>
            </div>
          </div>

          <div class="button-container">
            <button
              nbButton
              [status]="mode === 'validate' ? 'success' : 'primary'"
              type="submit"
              [disabled]="budgetForm.invalid || loading"
              class="mt-3"
              fullWidth
              *ngIf="mode === 'validate' ? isChefDepartement() : true"
            >
              <nb-icon [icon]="mode === 'validate' ? 'checkmark-outline' : 'save-outline'"></nb-icon>
              {{ mode === 'validate' ? 'Valider le Budget' : 'Enregistrer le Budget' }}
            </button>
            <div *ngIf="mode === 'validate' && !isChefDepartement()" class="mt-3 text-warning">
              <nb-icon icon="alert-triangle-outline"></nb-icon>
              Seul un chef de département peut valider un budget.
            </div>
          </div>
        </form>
      </nb-card-body>
    </nb-card>
  `,
  styles: [
    `
      .details-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
      }
      .detail-group,
      .form-group {
        margin-bottom: 1.5rem;
      }
      .label {
        display: block;
        font-weight: bold;
        margin-bottom: 0.5rem;
        color: nb-theme(text-hint-color);
      }
      p {
        margin-bottom: 0.5rem;
      }
      .budget-form {
        max-width: 600px;
        margin: 0 auto;
      }
      .row {
        display: flex;
        margin: 0 -0.75rem;
      }
      .col-md-6 {
        flex: 0 0 50%;
        padding: 0 0.75rem;
      }
    `,
  ],
})
export class BudgetDetailsComponent implements OnInit {
  @Input() budget: Budget;
  @Input() employeInfo: any;
  @Input() mode: 'view' | 'add' | 'validate' = 'view';
  @Input() budgetInitiaux: BudgetInitial[] = [];

  budgetForm: FormGroup;
  loading = false;

  constructor(
    protected dialogRef: NbDialogRef<BudgetDetailsComponent>,
    private formBuilder: FormBuilder,
    private budgetService: BudgetService,
    private toastrService: NbToastrService,
    private authService: AuthService,
  ) {}

  isChefDepartement(): boolean {
    return this.authService.isChefDepartement();
  }

  getHeaderText(): string {
    switch (this.mode) {
      case 'view':
        return 'Détails du Budget';
      case 'add':
        return 'Ajouter un Budget';
      case 'validate':
        return 'Validation du Budget';
      default:
        return '';
    }
  }

  ngOnInit(): void {
    if (this.mode === 'add') {
      this.initializeForm();
    } else if (this.mode === 'validate' && this.budget) {
      this.initializeFormWithBudget();
    }
  }

  private initializeForm(): void {
    this.budgetForm = this.formBuilder.group({
      idBudgetInitial: ['', Validators.required],
      libelle: ['', [Validators.required, Validators.minLength(3)]],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
    });

    // Ajouter des validateurs pour vérifier que la date de fin est après la date de début
    this.budgetForm.get('dateFin').valueChanges.subscribe(() => {
      this.validateDates();
    });

    this.budgetForm.get('dateDebut').valueChanges.subscribe(() => {
      this.validateDates();
    });
  }

  private initializeFormWithBudget(): void {
    const dateDebut = this.budget.budgetPK?.dateDebut
      ? new Date(this.budget.budgetPK.dateDebut).toISOString().split('T')[0]
      : '';
    const dateFin = this.budget.budgetPK?.dateFin
      ? new Date(this.budget.budgetPK.dateFin).toISOString().split('T')[0]
      : '';

    this.budgetForm = this.formBuilder.group({
      idBudgetInitial: [{ value: this.budget.budgetInitial?.id, disabled: true }, Validators.required],
      libelle: [
        { value: this.budget.budgetPK?.libelle, disabled: true },
        [Validators.required, Validators.minLength(3)],
      ],
      dateDebut: [{ value: dateDebut, disabled: true }, Validators.required],
      dateFin: [{ value: dateFin, disabled: true }, Validators.required],
    });
  }

  private validateDates(): void {
    const dateDebut = this.budgetForm.get('dateDebut').value;
    const dateFin = this.budgetForm.get('dateFin').value;

    if (dateDebut && dateFin) {
      if (new Date(dateDebut) > new Date(dateFin)) {
        this.budgetForm.get('dateFin').setErrors({ dateInvalide: true });
      }
    }
  }

  onSubmit(): void {
    if (this.budgetForm.valid) {
      // Vérifier le rôle pour la validation
      if (this.mode === 'validate' && !this.isChefDepartement()) {
        this.toastrService.warning('Vous devez être chef de département pour valider un budget.', 'Accès refusé');
        return;
      }

      this.loading = true;
      const formValue = this.budgetForm.getRawValue(); // Pour obtenir les valeurs même des champs désactivés
      const loggedInEmployeeId = this.authService.getLoggedInEmployeeId();

      if (!loggedInEmployeeId) {
        this.toastrService.danger('Vous devez être connecté.', 'Erreur');
        this.loading = false;
        return;
      }

      if (this.mode === 'validate') {
        // Mode validation
        this.budgetService
          .validerBudget(
            Number(formValue.idBudgetInitial),
            this.budget.employe,
            formValue.libelle,
            formValue.dateDebut,
            formValue.dateFin,
            Number(loggedInEmployeeId),
          )
          .subscribe(
            () => {
              this.loading = false;
              this.toastrService.success('Budget validé avec succès', 'Succès');
              this.dialogRef.close(true);
            },
            error => {
              this.loading = false;
              this.toastrService.danger(error.error?.message || 'Erreur lors de la validation du budget', 'Erreur');
            },
          );
      } else {
        // Mode ajout
        // Vérification des dates
        if (new Date(formValue.dateDebut) > new Date(formValue.dateFin)) {
          this.toastrService.danger('La date de début doit être antérieure à la date de fin.', 'Erreur');
          this.loading = false;
          return;
        }

        this.budgetService
          .ajouterBudget(
            Number(formValue.idBudgetInitial),
            Number(loggedInEmployeeId),
            formValue.libelle,
            formValue.dateDebut,
            formValue.dateFin,
          )
          .subscribe(
            () => {
              this.loading = false;
              this.toastrService.success('Budget créé avec succès', 'Succès');
              this.dialogRef.close(true);
            },
            error => {
              this.loading = false;
              this.toastrService.danger('Erreur lors de la création du budget', 'Erreur');
            },
          );
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
