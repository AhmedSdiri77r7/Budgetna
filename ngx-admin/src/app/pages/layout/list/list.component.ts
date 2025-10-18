
import { Component } from '@angular/core';
import { Employe } from '../../../model/employe';
import { Direction } from '../../../model/direction';
import { DirectionService } from '../../../services/direction.service';
import { EmployeService } from '../../../services/employe.service';
import { fruits } from './fruits-list';
import { Entreprise } from '../../../model/entreprise';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../services/token-storage.service';

@Component({
  selector: 'ngx-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.scss','list.component.css'],
})
export class ListComponent {
  listdirections:Direction[];
  listemploye:Employe[];
  employe:Employe;
  direction:Direction;
  selectedEntrepriseId:number;
  selectedDirection = Direction[0];
  constructor(private tokenStorage:TokenStorageService,private employeService:EmployeService,private serviceDirection:DirectionService,private _router:Router) { }

  ngOnInit(): void { 
    this.serviceDirection.$eventEmit.subscribe((data)=> {
      this.direction=data;
      //this.selectedEntrepriseId=data.entreprise.id;
      console.log(this.direction);
    },err => {
      this._router.navigateByUrl("/auth");
      this.tokenStorage.signOut();
    });
    this.getDirections();
  }
    
  directionSelection(direction:Direction){

    this.selectedDirection = direction;
    this.getUsers()
  }
  

  public getDirections(): void {
    this.serviceDirection.getDirections().subscribe(
      (response: Direction[]) => {
        this.listdirections = response;
        console.log(this.listdirections);
        this.selectedDirection = this.listdirections[0];
        this.getUsers();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
          this._router.navigateByUrl("/auth");
          this.tokenStorage.signOut();
      }
    );
  }
 

  public getUsers(): void {
    
      this.employeService.getEmployerByDirection(this.selectedDirection.id).subscribe(data=>{
        this.listemploye=data;
        console.log(data);
      },err => {
        this._router.navigateByUrl("/auth");
        this.tokenStorage.signOut();
      })
    
    
  }
   
}
