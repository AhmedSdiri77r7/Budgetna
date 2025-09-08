import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { BudgetService } from '../../../services/budget.service';
import { EmployeService } from '../../../services/employe.service';
import { TokenStorageService } from '../../../services/token-storage.service';
import { Budget } from '../../../model/Budget';
import { Employe } from '../../../model/employe';
import { AuthService } from '../../../services/auth.service';
import { BudgetInitial } from '../../../model/budgetInitial';

@Component({
  selector: 'ngx-accordion',
  templateUrl: 'accordion.component.html',
  styleUrls: ['accordion.component.scss'],
})
export class AccordionComponent implements OnInit {
  budgets: Budget[];
  listemploye: Employe[];
  employe: Employe;
  checked: boolean = false;
  idEmploye: number;
  validationMessage: string | null = null;
  budgetInitiaux: BudgetInitial[] = [];
  
  budgetForm = new FormGroup({
    idBudgetInitial: new FormControl(''),
    idEmploye: new FormControl(''),
    libelle: new FormControl(''),
    dateDebut: new FormControl(''),
    dateFin: new FormControl(''),
    valide: new FormControl(''),
  });

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private budgetService: BudgetService,
    private employeService: EmployeService, private authService: AuthService
  ) {}

  @ViewChild('item', { static: true }) accordion;

  toggle1(event: any) {
    this.checked = event;
    console.log('Checkbox value:', this.checked);
    // Do something else with the checkbox value, if needed
  }

  toggle2() {
    console.log('Button clicked');
    // Do something else when the button is clicked
  }

  ngOnInit(): void {
    this.getInitialBudgets();
    this.getUsers();
   
  }
  getInitialBudgets(): void {
   
    this.budgetService.getBudgetInitial().subscribe(
      (data: BudgetInitial[]) => {
        this.budgetInitiaux = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getUsers(): void {
    this.employeService.getEmployes().subscribe(
      (data: Employe[]) => {
        this.listemploye = data;
        console.log(data);
      },
      (error) => {
        console.error(error);
        this.router.navigateByUrl('/auth');
        this.tokenStorage.signOut();
      }
    );
  }

  onSubmit(): void {
    const { idBudgetInitial, idEmploye, libelle, dateDebut, dateFin } = this.budgetForm.value;
    
    // Get the ID of the currently logged-in employee
    const loggedInEmployeeId = this.authService.getLoggedInEmployeeId();
    
    if (loggedInEmployeeId) {
      const valide = loggedInEmployeeId; // Set the valide parameter to the logged-in employee ID
      
      this.budgetService.validerBudget(idBudgetInitial, idEmploye, libelle, dateDebut, dateFin, valide)
        .subscribe(
          () => {
            this.validationMessage = 'Budget validé!'; // Update validation message on success
            console.log('Budget validé!');
          },
          (error) => {
            this.validationMessage = 'Une erreur s\'est produite lors de la validation.'; // Update validation message on error
            console.error(error);
          }
        );
    }
  
  }
}
