import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableData } from '../../../@core/data/smart-table';
import { Employe } from '../../../model/employe';
import { EmployeService } from '../../../services/employe.service';


@Component({
  selector: 'ngx-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss'],

})
export class SmartTableComponent {
  [x: string]: any;
  public listemploye: Employe[];
  public editUsers: Employe;
  public deleteUsers: Employe;
  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
      },
      nom: {
        title: 'nom',
        type: 'string',
      },
      prenom: {
        title: 'prenom',
        type: 'string',
      },
      role: {
        title: 'role',
        type: 'string',
      },
      email: {
        title: 'email',
        type: 'string',
      },
     
      direction: {
        title: 'direction',
        type: 'string',
      },
    },
  };

  data = [
    this.service
  ];

  source: LocalDataSource = new LocalDataSource();

 



  constructor(private service: SmartTableData, employeService: EmployeService) {
    const data = this.service.getData();
    this.source.load(this.data);
  }


  
   ngOnInit(): void {
    this.getUsers();
  }
  public getUsers(): void {
    this.employeService.getEmployes().subscribe(
      (response: Employe[]) => {
        this.listemploye = response;
        console.log(this.listemploye);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }


  public addEmploye(addForm: NgForm): void {
    document.getElementById('add-users-form').click();
    this.employeService.addEmploye(addForm.value).subscribe(
      (response: Employe) => {
        console.log(response);
        this.getUsers();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }



  public onUpdateUsers(listemploye: Employe): void {
    this.employeService.updateEmploye(this.listemploye).subscribe(
      (response: Employe) => {
        console.log(response);
        this.getUsers();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteUsers(employeId: number): void {
    this.employeService.deleteEmploye(employeId).subscribe(
      (response: void) => {
        console.log(response);
        this.getUsers();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onOpenModal(listemploye: Employe, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeModal');
    }
    if (mode === 'edit') {
      this.updateEmploye = Employe;
      button.setAttribute('data-target', '#updateEmployeModal');
    }
    if (mode === 'delete') {
      this.deleteEmploye = Employe;
      button.setAttribute('data-target', '#deleteEmployeModal');
    }
    container.appendChild(button);
    button.click();
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
