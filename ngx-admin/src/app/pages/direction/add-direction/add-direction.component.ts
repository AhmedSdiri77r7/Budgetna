import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BudgetInitial } from '../../../model/budgetInitial';
import { BudgetRevise } from '../../../model/budgetRevise';
import { Direction } from '../../../model/direction';
import { Entreprise } from '../../../model/entreprise';
import { DirectionService } from '../../../services/direction.service';
import { EntrepriseService } from '../../../services/entreprise.service';

@Component({
  selector: 'ngx-add-direction',
  templateUrl: './add-direction.component.html',
  styleUrls: ['./add-direction.component.scss']
})
export class AddDirectionComponent implements OnInit {
  direction:Direction=new Direction();
  selectedEntrepriseId:number;
  entreprises:Entreprise[];
  constructor(private _router:Router,private dialogRef:MatDialogRef<AddDirectionComponent>,private serviceEntreprise:EntrepriseService,private serviceDirection:DirectionService) { }

  ngOnInit(): void {
    this.serviceEntreprise.getEntreprises().subscribe((data)=>this.entreprises=data);
    //this.direction.budgetInitials=new BudgetInitial();
    //this.direction.budgetRevise=new BudgetRevise();
  }
  addDirection(){


    this.serviceDirection.addDirection(this.direction,this.selectedEntrepriseId).subscribe(()=>{
      this.dialogRef.close();
      this._router.navigateByUrl("/pages/direction").then(()=>window.location.reload());
      console.log(this.direction);
    })
  }
}
