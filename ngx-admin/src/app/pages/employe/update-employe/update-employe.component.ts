import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Direction } from '../../../model/direction';
import { Employe } from '../../../model/employe';
import { DirectionService } from '../../../services/direction.service';
import { EmployeService } from '../../../services/employe.service';

@Component({
  selector: 'ngx-update-employe',
  templateUrl: './update-employe.component.html',
  styleUrls: ['./update-employe.component.scss']
})
export class UpdateEmployeComponent implements OnInit {
  employe:Employe=new Employe();
  selectedDirectionId:number;
  selectedEmployeId:number;
  directions:Direction[];
  constructor(private _router:Router,private dialogRef:MatDialogRef<UpdateEmployeComponent>,private serviceDirection:DirectionService,private serviceEmploye:EmployeService) { }

  ngOnInit(): void {
    this.serviceDirection.getDirections().subscribe((data) => this.directions = data);
    this.serviceEmploye.$eventEmit.subscribe((data) => {
      this.employe = data;
      if (data.direction != null) {
        this.selectedDirectionId = data.direction.id;
      }
      this.selectedEmployeId = data.id; // set selectedEmployeId to employe.id
      console.log(this.employe);
    });
  }
  
  addEmploye(){
    
    this.serviceEmploye.affecterEmployeADirection(this.selectedEmployeId,this.selectedDirectionId).subscribe(()=>{
      this.dialogRef.close();
      this._router.navigateByUrl("/pages/employe").then(()=>window.location.reload());
      console.log(this.employe);
    })
  }
}
