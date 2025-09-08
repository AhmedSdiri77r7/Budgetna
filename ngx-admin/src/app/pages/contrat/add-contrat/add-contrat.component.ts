import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Contrat } from '../../../model/contrat';
import { Employe } from '../../../model/employe';
import { ContratService } from '../../../services/contrat.service';
import { EmployeService } from '../../../services/employe.service';
import { EntrepriseService } from '../../../services/entreprise.service';
import { TokenStorageService } from '../../../services/token-storage.service';

@Component({
  selector: 'ngx-add-contrat',
  templateUrl: './add-contrat.component.html',
  styleUrls: ['./add-contrat.component.scss']
})
export class AddContratComponent implements OnInit {
  selectedEmployeId:number;
  employees:Employe[];
  contrat:Contrat=new Contrat();
  constructor(private tokenStorage:TokenStorageService,private employeService:EmployeService,private contratService:ContratService,private _router:Router,private dialogRef:MatDialogRef<AddContratComponent>) { }

  ngOnInit(): void {
    this.getEmployees();
  }
  public getEmployees(): void {
    this.employeService.getEmployes().subscribe(
      (response: Employe[]) => {
        this.employees = response;
        console.log(this.employees);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
          this._router.navigateByUrl("/auth");
          this.tokenStorage.signOut();
      }
    );
  }
  addContrat(){
    this.contratService.addContrat(this.contrat,this.selectedEmployeId).subscribe(()=>{
      this.dialogRef.close();
      this._router.navigateByUrl("/pages/contrat").then(()=>window.location.reload());
    },err => {
      this._router.navigateByUrl("/auth");
      this.tokenStorage.signOut();
    })
  }

}
