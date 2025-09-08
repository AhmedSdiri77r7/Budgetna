import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Contrat } from '../../model/contrat';
import { ContratService } from '../../services/contrat.service';
import { ExcelService } from '../../services/excel.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { AddContratComponent } from './add-contrat/add-contrat.component';
import { UpdateContratComponent } from './update-contrat/update-contrat.component';

@Component({
  selector: 'ngx-contrat',
  templateUrl: './contrat.component.html',
  styleUrls: ['./contrat.component.scss']
})
export class ContratComponent implements OnInit {
  listcontrats:Contrat[];
  contrat:Contrat;
  constructor(private tokenStorage:TokenStorageService,private _router:Router,private contratService:ContratService,private matDialog:MatDialog,private excelService:ExcelService) { }

  ngOnInit(): void {
    this.getContrats();
  }
  onOpenDialogClick(){
    this.matDialog.open(AddContratComponent);
  }
  updateContrat(idContrat:number){
    
    this.contrat=this.contratService.sendEventData(idContrat);
    this.matDialog.open(UpdateContratComponent);
  }
  deleteContrat(id:number):void{
    
    this.contratService.deleteContrat(id).subscribe(()=>{
      
      this.contratService.getContrats().subscribe((data)=>{this.listcontrats=data},err => {
        this._router.navigateByUrl("/auth");
        this.tokenStorage.signOut();
      })
    },err => {
      this._router.navigateByUrl("/auth");
      this.tokenStorage.signOut();
    })
}
  public getContrats(): void {
    this.contratService.getContrats().subscribe(
      (response: Contrat[]) => {
        console.log(response);
        this.listcontrats = response;
        console.log(this.listcontrats);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
          this._router.navigateByUrl("/auth");
          this.tokenStorage.signOut();
      }
    );
  }
  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.listcontrats, 'listcontrats');
  }
}
