import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { mergeAll } from 'rxjs-compat/operator/mergeAll';
import { tap } from 'rxjs/operators';
import { Direction } from '../../model/direction';
import { DirectionService } from '../../services/direction.service';
import { ExcelService } from '../../services/excel.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { AddDirectionComponent } from './add-direction/add-direction.component';
import { UpdateDirectionComponent } from './update-direction/update-direction.component';

@Component({
  selector: 'ngx-direction',
  templateUrl: './direction.component.html',
  styleUrls: ['./direction.component.scss']
})
export class DirectionComponent implements OnInit {
  listdirections:Direction[];
  search:string;
  direction:Direction;
  constructor(private _router:Router,private tokenStorage:TokenStorageService,private serviceDirection:DirectionService,private matDialog:MatDialog,private excelService:ExcelService) { }

  ngOnInit(): void {
    this.serviceDirection.getDirections().subscribe((data)=>{

      console.log(data);
      console.log();
      this.listdirections=data;
    },err => {
      this._router.navigateByUrl("/auth");
      this.tokenStorage.signOut();
    });
  }
  onOpenDialogClick(){
    this.matDialog.open(AddDirectionComponent);
  }
  deleteDirection(id:number){
    this.serviceDirection.deleteDirection(id).subscribe(()=>{
      this.serviceDirection.getDirections().subscribe((data)=>{
        this.listdirections=data;
        console.log(data);
      })
    },err => {
      this._router.navigateByUrl("/auth");
      this.tokenStorage.signOut();
    });
  }
  searchfct(){
    
      this.listdirections=this.listdirections.filter(res=>{
        if(res.name.toLocaleLowerCase().match(this.search.toLocaleLowerCase())){
          return true;
        }

        if(res.entreprise.name.toLocaleLowerCase().match(this.search.toLocaleLowerCase())){
          return true;
        }
        else{
          return false;
        }
      })
    
  }
  updateDirection(id:number){
    this.direction=this.serviceDirection.sendEventData(id);
    this.matDialog.open(UpdateDirectionComponent);
  }
  exportAsXLSX():void {
    
    this.downloadFile(this.listdirections,'test');
  }
  downloadFile(data, filename='data') {
    let csvData = this.ConvertToCSV(data, ['id','name', 'budgetInitials', 'budgetRevise', 'entreprise']);
    
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    console.log(csvData)
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
}
ConvertToCSV(objArray, headerList) {
  let headerList2=['id','name','description','tauxBudget'];
     let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
     console.log(array)
     let str = '';
     let row = 'S.No,';

         row += headerList[0] + ',';
         row += headerList[1] + ',';
         row += headerList[2] + ',';
         row+=',';
         row+=',';
         row+=',';
         row += headerList[3] + ',';
         row+=',';
         row+=',';
         row+=',';
         row += headerList[4] + ',';
         row+=',';
         row+=',';
         row+=',';
         
     
     row = row.slice(0, -1);
     str += row + '\r\n';
     for (let i = 0; i < array.length; i++) {
         let line = (i+1)+'';
         for (let index in headerList) {
            let head = headerList[index];

if(typeof(array[i][head])=='object'){
  if(array[i][head]!=null){
    for(let index2 in headerList2){
      let head2=headerList2[index2];
      line += ',' + array[i][head][head2];
    }
  }
  else{
    line+= ','+"null";
    line+= ','+"null";
    line+= ','+"null";
    line+= ','+"null";
  }
  
  
}

else{
  
  line += ',' + array[i][head];
}
         }
         str += line + '\r\n';
     }
     return str;
 }
}
