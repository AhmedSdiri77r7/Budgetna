import { Component, Input, OnInit } from '@angular/core';
import { BudgetInitial } from '../../../../model/budgetInitial';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { BudgetService } from '../../../../services/budget.service';


@Component({
  selector: 'ngx-news-post',
  templateUrl: 'news-post.component.html',
  styleUrls: ['./news-post.component.scss']
})
export class NewsPostComponent implements OnInit {

  budgetInitial:BudgetInitial=new BudgetInitial();

  constructor(private _router:Router,private dialogRef:MatDialogRef<NewsPostComponent>,private budgetService: BudgetService) { }

  ngOnInit(): void {
    this.budgetInitial=new BudgetInitial();
  }
  addBI(){
    
    this.budgetService.ajouterBudgetInitial(this.budgetInitial).subscribe(()=>{
    
    this.dialogRef.close();
    this._router.navigateByUrl("/pages/layout/infinite-list").then(()=>window.location.reload());
    console.log(this.budgetInitial); 
  })
  }
}
