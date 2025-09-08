import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { DirectionService } from '../../services/direction.service';
import { ExcelService } from '../../services/excel.service';
import { TokenStorageService } from '../../services/token-storage.service';

import { Direction } from '../../model/direction';
import { AddCompteAnalytiqueComponent } from './add-compte-analytique/add-compte-analytique.component';
import { UpdateCompteAnalytiqueComponent } from './update-compte-analytique/update-compte-analytique.component';
import { BudgetReviseComponent } from './budget-revise/budget-revise.component';

@Component({
  selector: 'ngx-compte-analytique',
  templateUrl: './compte-analytique.component.html',
  styleUrls: ['./compte-analytique.component.scss']
})
export class CompteAnalytiqueComponent implements OnInit {
  selectedDirection:number;
  listdirections:Direction[];
  search:string;
  taux:string[]=[];
  direction:Direction;
  constructor(private _router:Router,private tokenStorage:TokenStorageService,private serviceDirection:DirectionService,private matDialog:MatDialog,private excelService:ExcelService) { }

  ngOnInit(): void {
    this.serviceDirection.getDirections().subscribe((data) => {
      console.log(data);
      data.forEach((element) => {
        if (element.budgetRevise == null) {
          this.taux.push("-");
        } else {
          this.taux.push(element.budgetRevise.tauxBudget + "");
        }
  
        if (element.budgetInitial == null) {
          this.taux.push("-");
        } else {
          this.taux.push(element.budgetInitial.tauxBudget + "");
        }
      });
      console.log(this.taux);
      this.listdirections = data;
    });


    
  }
  
  
  onOpenDialogClick(){
    this.matDialog.open(AddCompteAnalytiqueComponent);
  }
  onOpenDialogClick1(){
    this.matDialog.open(BudgetReviseComponent);
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
        if(res.budgetInitial.tauxBudget.toString().toLocaleLowerCase().match(this.search.toLocaleLowerCase())){
          return true;
        }
        if(res.budgetRevise.tauxBudget.toString().toLocaleLowerCase().match(this.search.toLocaleLowerCase())){
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

  getBudgetInitialTaux(direction: Direction): string {
    return direction?.budgetInitial?.tauxBudget?.toString() || '-';
  }
  
  getBudgetReviseTaux(direction: Direction): string {
    return direction?.budgetRevise?.tauxBudget?.toString() || '-';
  }
  
  updateDirection(id:number){
    this.direction=this.serviceDirection.sendEventData(id);
    this.matDialog.open(UpdateCompteAnalytiqueComponent);
  }
 



  onDirectionChange() {
    // Vérifiez si une direction est sélectionnée
    if (this.selectedDirection) {
      // Recherchez la direction sélectionnée dans la liste des directions
      const selectedDirection = this.listdirections.find(direction => direction.id === this.selectedDirection);
  
      // Vérifiez si la direction sélectionnée a un budget initial défini
      if (selectedDirection && selectedDirection.budgetInitial) {
        // Affichez le budget initial de la direction sélectionnée
        console.log("Budget initial de la direction sélectionnée :", selectedDirection.budgetInitial);
      } else {
        console.log("Aucun budget initial disponible pour la direction sélectionnée.");
      }
    }
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
  let str = '';
  let header = headerList.join(',');
  str += header + '\r\n';

  for (let i = 0; i < objArray.length; i++) {
    let line = [];
    for (let key of headerList) {
      if (key === 'budgetInitial' || key === 'budgetRevise') {
        if (objArray[i][key]) {
          // Si la clé est 'budgetInitial' ou 'budgetRevise', extrayez les propriétés pertinentes.
          line.push(objArray[i][key].id || 'null');
          line.push(objArray[i][key].name || 'null');
          line.push(objArray[i][key].description || 'null');
          line.push(objArray[i][key].tauxBudget || 'null');
        } else {
          // Si la clé n'existe pas, ajoutez des valeurs 'null'.
          line.push('null', 'null', 'null', 'null');
        }
      } else {
        // Pour d'autres clés, ajoutez simplement la valeur.
        line.push(objArray[i][key]);
      }
    }
    str += line.join(',') + '\r\n';
  }

  return str;
}
}