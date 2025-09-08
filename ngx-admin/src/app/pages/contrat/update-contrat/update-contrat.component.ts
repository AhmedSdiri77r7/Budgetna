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
  selector: 'ngx-update-contrat',
  templateUrl: './update-contrat.component.html',
  styleUrls: ['./update-contrat.component.scss']
})
export class UpdateContratComponent implements OnInit {
  selectedEmployeId:number;
  employees:Employe[];
  contrat:Contrat=new Contrat();
  constructor(private tokenStorage:TokenStorageService,private employeService:EmployeService,private contratService:ContratService,private _router:Router,private dialogRef:MatDialogRef<UpdateContratComponent>) { }

  ngOnInit(): void {
    this.contratService.$eventEmit.subscribe((data)=> {
      this.contrat=data;
      this.selectedEmployeId=data.employe.id;
      console.log(this.contrat);
    },err => {
      this._router.navigateByUrl("/auth");
      this.tokenStorage.signOut();
    })
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
      this._router.navigateByUrl('/pages/contrat', { skipLocationChange: true }).then(() => {
        this._router.navigate(['/pages/contrat']);
      }); 
    },err => {
      this._router.navigateByUrl("/auth");
      this.tokenStorage.signOut();
    })
  }

}
