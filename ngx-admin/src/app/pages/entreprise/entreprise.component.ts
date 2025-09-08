import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { MatDialog } from '@angular/material/dialog';
import { SmartTableData } from '../../@core/data/smart-table';
import { Entreprise } from '../../model/entreprise';
import { EntrepriseService } from '../../services/entreprise.service';
import { AddEntrepriseComponent } from './add-entreprise/add-entreprise.component';
import { UpdateEntrepriseComponent } from './update-entreprise/update-entreprise.component';
import { ExcelService } from '../../services/excel.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { Router } from '@angular/router';


@Component({
  selector: 'ngx-entreprise',
  templateUrl: './entreprise.component.html',
  styleUrls: ['./entreprise.component.scss']
})
export class EntrepriseComponent implements OnInit {
  public entreprises: Entreprise[];
  public editEntreprise: Entreprise;
  entreprise:Entreprise;
  //public deleteEntreprise: Entreprise;
  

  constructor(private _router:Router,private tokenStorage:TokenStorageService,private service: SmartTableData, private entrepriseService: EntrepriseService,private matDialog:MatDialog,private excelService:ExcelService ) {
    
  }


  
   ngOnInit() {
    this.getEntreprises();
    console.log("hello");

  }
  public getEntreprises(): void {
    this.entrepriseService.getEntreprises().subscribe(
      (response: Entreprise[]) => {
        this.entreprises = response;
        console.log(this.entreprises);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
          this._router.navigateByUrl("/auth");
          this.tokenStorage.signOut();
      }
    );
  }
  deleteEntr(id:number):void{
    
      this.entrepriseService.deleteEntreprise(id).subscribe(()=>{
        
        this.entrepriseService.getEntreprises().subscribe((data)=>this.entreprises=data,err => {
          this._router.navigateByUrl("/auth");
          this.tokenStorage.signOut();
        });
      },err => {
        this._router.navigateByUrl("/auth");
        this.tokenStorage.signOut();
      });
  }
  onOpenDialogClick(){
    this.matDialog.open(AddEntrepriseComponent);
    
  }
  updateEntreprise(idEntreprise:number){
    
    this.entreprise=this.entrepriseService.sendEventData(idEntreprise);
    this.matDialog.open(UpdateEntrepriseComponent);
  }

  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.entreprises, 'listentreprise');
  }

}
