import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BudgetInitial } from '../../../model/budgetInitial';
import { BudgetRevise } from '../../../model/budgetRevise';
import { Direction } from '../../../model/direction';
import { Entreprise } from '../../../model/entreprise';
import { DirectionService } from '../../../services/direction.service';
import { EntrepriseService } from '../../../services/entreprise.service';
import { TokenStorageService } from '../../../services/token-storage.service';

@Component({
  selector: 'ngx-update-direction',
  templateUrl: './update-direction.component.html',
  styleUrls: ['./update-direction.component.scss']
})
export class UpdateDirectionComponent implements OnInit {

  direction:Direction=new Direction();
  selectedEntrepriseId:number;
  entreprises:Entreprise[];
  constructor(private _router:Router,private tokenStorage:TokenStorageService,private dialogRef:MatDialogRef<UpdateDirectionComponent>,private serviceEntreprise:EntrepriseService,private serviceDirection:DirectionService) { }

  ngOnInit(): void {
    this.serviceEntreprise.getEntreprises().subscribe((data)=>this.entreprises=data,err => {
      this._router.navigateByUrl("/auth");
      this.tokenStorage.signOut();
    });
    this.serviceDirection.$eventEmit.subscribe((data)=> {
      
      console.log(this.direction);
      this.direction=data;

      if(data.entreprise!=null){
        this.selectedEntrepriseId=data.entreprise.id;
      }
      
      console.log(this.direction);
    },err => {
      this._router.navigateByUrl("/auth");
      this.tokenStorage.signOut();
    });
    

  }
  addDirection(){
    
    this.serviceDirection.addDirection(this.direction,this.selectedEntrepriseId).subscribe(()=>{
      this.dialogRef.close();
      this._router.navigateByUrl("/pages/direction").then(()=>window.location.reload());
      console.log(this.direction);
    },err => {
      this._router.navigateByUrl("/auth");
      this.tokenStorage.signOut();
    });
  }
}
