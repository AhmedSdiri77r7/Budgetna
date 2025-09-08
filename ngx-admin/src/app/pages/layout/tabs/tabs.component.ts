import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Budget } from '../../../model/Budget';
import { BudgetService } from '../../../services/budget.service';
import { ExcelService } from '../../../services/excel.service';
import { EmployeService } from '../../../services/employe.service';
import { AuthService } from '../../../services/auth.service';
import { BudgetInitial } from '../../../model/budgetInitial';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'ngx-tab1',
  template: `
  <ng-template style="position:relative" #modelcontent2>
  <div class="card-body">
  <div *ngFor="let budget of budgets">
      <h2>ID Budget Initial: {{ budget?.budgetPK?.idBudgetInitial }}</h2>
      <h3>Employe: {{ (budget.budgetPK.idEmploye) }}</h3>

      <h3>libelle: {{ budget.budgetPK.libelle }}</h3>
      <p>Date Debut: {{ budget.budgetPK.dateDebut | date }}</p>
      <p>Date Fin: {{ budget.budgetPK.dateFin | date }}</p>
      <h4>Budget Initial:</h4>
      <p>ID: {{ budget.budgetInitial.id }}</p>
      <p>Name: {{ budget.budgetInitial.name }}</p>
      <p>Description: {{ budget.budgetInitial.description }}</p>
      <p>Taux Budget: {{ budget.budgetInitial.tauxBudget }}</p>
      <h4>Employe:</h4>
      <p>ID: {{ budget.employe.id }}</p>
      <p>Prénom: {{ budget.employe.prenom }}</p>
      <p>Nom: {{ budget.employe.nom }}</p>
      <p>Email: {{ budget.employe.email }}</p>
      <!-- ... Autres propriétés de l'employé ... -->
      <h2>Valide: {{ budget.valide }}</h2>
    </div>
    <button  (click)="close()">close</button>
  </div>
  
  </ng-template>
 
  <ng-template #modelcontent1>
  
  <form (ngSubmit)="onSubmit()" >
  <div class="form-container">
  <div>
<label for="idBudgetInitial">Budget Initial:</label>
<select id="idBudgetInitial" [(ngModel)]="idBudgetInitial" name="idBudgetInitial" required>
  <option *ngFor="let budget of budgetInitiaux" [value]="budget.id">{{ budget.name }}</option>
</select>
</div>

    <div>
      <label for="libelle">libelle:</label>
      <input type="text" id="libelle" [(ngModel)]="libelle" name="libelle" required>
    </div>
    <div>
      <label for="dateDebut">Date Debut:</label>
      <input type="date" id="dateDebut" [(ngModel)]="dateDebut" name="dateDebut" required>
    </div>
    <div>
      <label for="dateFin">Date Fin:</label>
      <input type="date" id="dateFin" [(ngModel)]="dateFin" name="dateFin" required>
    </div>
    <button type="submit">Add Budget</button>
    </div>
  </form>

  </ng-template>
  <button mat-button  class="text-end" (click)="exportAsXLSX()">Export to Excel</button>
    <button mat-button class="text-end" (click)="openmodal()">Ajouter un budget</button>
  <table class="table">
  <thead class="text-primary">
  <th>ID Budget Initial</th> <th> ID Employee</th><th>libelle</th> <th>DateDebut</th><th>DateFin</th>statut<th>
  
  

  </thead>
  <tbody>
  <tr *ngFor="let budget of budgets">
   <td>{{ budget?.budgetPK?.idBudgetInitial }}</td>
  <td>{{ budget.budgetPK.idEmploye }}</td>
  <td>{{ budget.budgetPK.libelle }}</td>
  <td>{{ budget.budgetPK.dateDebut | date }}</td>
  <td> {{ budget.budgetPK.dateFin | date }}</td>
  <td [ngClass]="budget.valide=='true' ? 'red' : 'green'">{{ budget.valide }}</td>
  <td>
  <button class="btn btn-outlin-info" (click)="opendet()">Details</button></td>
 
  
 

  </tr>
  </tbody>
  </table>

    
    
  `,
 styleUrls: ['./tab1.component.scss']
})
export class Tab1Component implements OnInit {
  @ViewChild("modelcontent1") modelcontent1:TemplateRef<any>
  @ViewChild("modelcontent2") modelcontent2:TemplateRef<any>
  idBudgetInitial: number;
  idEmploye: number;
  dateDebut: Date;
  dateFin: Date;
  libelle: string;
  budgets: Budget[];
  budgetInitiaux: BudgetInitial[] = [];
  loggedInEmployeeId: number | null;
  constructor(private budgetService: BudgetService, private authService: AuthService,private excelService:ExcelService,private employeService:EmployeService,private dialo:MatDialog) {}

 


  ngOnInit(): void {
   this.fetchBudgets()
    this.getInitialBudgets();
    this.loggedInEmployeeId = this.authService.getLoggedInEmployeeId();
    this.fetchBudgets();
    
  }
  openmodal(){
    this.dialo.open(this.modelcontent1,{width:"100%"})
  }
  opendet(){
    this.dialo.open(this.modelcontent2,{width:"100%",height:"100%"})

  }
  close(){
    this.dialo.closeAll()
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


  onSubmit() {

    const loggedInEmployeeId = this.authService.getLoggedInEmployeeId();
    if (loggedInEmployeeId) {
      this.budgetService
        .ajouterBudget(
          this.idBudgetInitial,
          loggedInEmployeeId,
          this.libelle,
          new Date(this.dateDebut),
          new Date(this.dateFin)
        )
        .subscribe(
          () => {
            this.dialo.closeAll()
            this.fetchBudgets();

          },
          error => {
            console.error(error);
          }
        );
    } else {
      console.error("Unable to get logged-in employee ID.");
    }
  }
  

  fetchBudgets() {
    const loggedInEmployeeId = this.authService.getLoggedInEmployeeId();
    if (loggedInEmployeeId) {
      this.budgetService
        .getBd()
        .subscribe(
          (budgets:any) => {
            this.budgets = budgets;
          },
          error => {
            console.error(error);
          }
        );
    } else {
      console.error("Unable to get logged-in employee ID.");
    }
  }
  
  
  exportAsXLSX(): void {
    const data = this.budgets.map(budget => ({
      idBudgetInitial: budget.budgetPK.idBudgetInitial,
      idEmploye: budget.budgetPK.idEmploye,
      libelle: budget.budgetPK.libelle,
      dateDebut: budget.budgetPK.dateDebut,
      dateFin: budget.budgetPK.dateFin,
      budgetInitial: {
        id: budget.budgetInitial.id,
        name: budget.budgetInitial.name,
        description: budget.budgetInitial.description,
        tauxBudget: budget.budgetInitial.tauxBudget
      },
   
      valide: budget.iSvalide
    }));
  
    const filename = 'listBudget';
    this.downloadFile(data, filename);
  }
  downloadFile(data, filename = 'data') {
    const headerList = ['ID Budget Initial', 'ID Employe', 'libelle', 'Date Debut', 'Date Fin'];
  
    let csvData = this.ConvertToCSV(data, headerList);
  
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }
  ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = '';
  
    // Add the header row
    for (let i = 0; i < headerList.length; i++) {
      row += headerList[i] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
  
    // Add the data rows
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in headerList) {
        let head = headerList[index];
        if (head === 'ID Budget Initial') {
          line += array[i].idBudgetInitial + ',';
        } else if (head === 'ID Employe') {
          line += array[i].idEmploye + ',';
        } else if (head === 'libelle') {
          line += array[i].libelle + ',';
        } else if (head === 'Date Debut') {
          line += array[i].dateDebut + ',';
        } else if (head === 'Date Fin') {
          line += array[i].dateFin + ',';
        }
      }
      line = line.slice(0, -1);
      str += line + '\r\n';
    }
    
    return str;
  }
  
}  


@Component({
  selector: 'ngx-tab2',
  template: `
    <!-- Add your Tab2 component template here -->
  `,
})
export class Tab2Component {}

@Component({
  selector: 'ngx-tabs',
  styleUrls: ['./tabs.component.scss'],
  templateUrl: './tabs.component.html',
})
export class TabsComponent {
  idEmploye: number;
  dateDebut: Date;
  dateFin: Date;
  budgets: Budget[];
  idBudgetInitial: number;
  libelle:string;

  constructor(private budgetService: BudgetService, private excelService:ExcelService) {}

  ngOnInit() {
    this.getBudgets();
  
  }

  onSubmit() {
    this.budgetService
      .ajouterBudget(this.idBudgetInitial, this.idEmploye, this.libelle, this.dateDebut, this.dateFin)
      .subscribe(
        () => {
          this.getBudgets();
        },
        error => {

        console.error(error);
      }
    );
}


getBudgets() {
  this.budgetService.getBudgetsByBudgetInitialAndDate(this.idEmploye.toString(), this.idBudgetInitial.toString(), this.libelle.toString(), this.dateDebut.toString(), this.dateFin.toString())
    .subscribe(
      budgets => {
        this.budgets = budgets;
      },
      error => {
        console.error(error);
      }
    );
}

}



