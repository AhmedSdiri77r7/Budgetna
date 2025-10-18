import { Component, HostBinding } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BudgetInitial } from '../../../../model/budgetInitial';
import { BudgetService } from '../../../../services/budget.service';

@Component({
  selector: 'ngx-news-post-placeholder',
  templateUrl: 'news-post-placeholder.component.html',
  styleUrls: ['news-post-placeholder.component.scss'],
})
export class NewsPostPlaceholderComponent {

  budgetInitial:BudgetInitial=new BudgetInitial();


  constructor(private _router:Router,private dialogRef:MatDialogRef<NewsPostPlaceholderComponent>,private budgetService:BudgetService) { }

 ngOnInit(): void {
    this.budgetService.$eventEmit.subscribe((data)=> {
      this.budgetInitial=data;
      console.log(this.budgetInitial);
    })
  }

  updateBI(){
    
    this.budgetService.ajouterBudgetInitial(this.budgetInitial).subscribe(()=>{
    
      this.dialogRef.close();
      this._router.navigateByUrl("/pages/layout/infinite-list").then(()=>window.location.reload());
      console.log(this.budgetInitial); 
    })
    }
  }
