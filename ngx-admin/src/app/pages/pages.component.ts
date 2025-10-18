import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbMenuItem } from '@nebular/theme';
import { Employe } from '../model/employe';
import { EmployeService } from '../services/employe.service';
import { TokenStorageService } from '../services/token-storage.service';

import { MENU_ITEMS } from './pages-menu';
import { MENU_ITEMS_ADMIN } from './pages-menu-admin';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit{

  menu : NbMenuItem[]
  emp : Employe ;

  constructor(private _router:Router,private tokenStorage:TokenStorageService,private empService: EmployeService) {

  }


  ngOnInit(): void {
    console.log("type"+typeof(localStorage.getItem('email')))
    this.empService.getEmployeByEmail(localStorage.getItem('email')).subscribe(data => 
      {
        this.emp = data;
        console.log("employe"+this.emp)
        console.log("employe role : "+this.emp.role)
        this.menu = MENU_ITEMS_ADMIN;
        if(this.emp.role == "ADMINISTRATEUR"){
        this.menu = MENU_ITEMS_ADMIN;
        }else{
          this.menu = MENU_ITEMS;
    }
      
      },err => {
        this._router.navigateByUrl("/auth");
        this.tokenStorage.signOut();
      });
    

    
     
  }

  
  
}
