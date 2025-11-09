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
  styleUrls: ['./direction.component.scss'],
})
export class DirectionComponent implements OnInit {
  listdirections: Direction[];
  directionsByEntreprise: Map<string, Direction[]> = new Map();
  search: string;
  direction: Direction;

  constructor(
    private _router: Router,
    private tokenStorage: TokenStorageService,
    private serviceDirection: DirectionService,
    private matDialog: MatDialog,
    private excelService: ExcelService,
  ) {}

  ngOnInit(): void {
    this.serviceDirection.getDirections().subscribe(
      data => {
        this.listdirections = data;

        // Group directions by entreprise
        this.directionsByEntreprise.clear();
        data.forEach(direction => {
          const entrepriseName = direction.entreprise?.name || 'Sans entreprise';
          if (!this.directionsByEntreprise.has(entrepriseName)) {
            this.directionsByEntreprise.set(entrepriseName, []);
          }
          this.directionsByEntreprise.get(entrepriseName).push(direction);
        });

        console.log('Directions by entreprise:', this.directionsByEntreprise);
      },
      err => {
        this._router.navigateByUrl('/auth');
        this.tokenStorage.signOut();
      },
    );
  }
  onOpenDialogClick() {
    this.matDialog.open(AddDirectionComponent);
  }
  deleteDirection(id: number) {
    this.serviceDirection.deleteDirection(id).subscribe(
      () => {
        this.serviceDirection.getDirections().subscribe(data => {
          this.listdirections = data;
          this.regroupDirections(data);
          console.log('Directions updated after delete:', this.directionsByEntreprise);
        });
      },
      err => {
        this._router.navigateByUrl('/auth');
        this.tokenStorage.signOut();
      },
    );
  }
  searchfct() {
    if (!this.search) {
      // Si la recherche est vide, réinitialiser le regroupement
      this.regroupDirections(this.listdirections);
      return;
    }

    const searchTerm = this.search.toLowerCase();
    const filteredDirections = this.listdirections.filter(
      direction =>
        direction.name.toLowerCase().includes(searchTerm) ||
        direction.entreprise?.name.toLowerCase().includes(searchTerm),
    );

    // Regrouper les directions filtrées
    this.regroupDirections(filteredDirections);
  }

  private regroupDirections(directions: Direction[]) {
    this.directionsByEntreprise.clear();
    directions.forEach(direction => {
      const entrepriseName = direction.entreprise?.name || 'Sans entreprise';
      if (!this.directionsByEntreprise.has(entrepriseName)) {
        this.directionsByEntreprise.set(entrepriseName, []);
      }
      this.directionsByEntreprise.get(entrepriseName).push(direction);
    });
  }
  updateDirection(id: number) {
    this.direction = this.serviceDirection.sendEventData(id);
    this.matDialog.open(UpdateDirectionComponent);
  }
  exportAsXLSX(): void {
    this.downloadFile(this.listdirections, 'test');
  }
  downloadFile(data, filename = 'data') {
    const csvData = this.ConvertToCSV(data, ['id', 'name', 'budgetInitials', 'budgetRevise', 'entreprise']);

    const blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    console.log(csvData);
    const dwldLink = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {
      // if Safari open in new window to save file with random filename.
      dwldLink.setAttribute('target', '_blank');
    }
    dwldLink.setAttribute('href', url);
    dwldLink.setAttribute('download', filename + '.csv');
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }
  ConvertToCSV(objArray, headerList) {
    const headerList2 = ['id', 'name', 'description', 'tauxBudget'];
    const array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    console.log(array);
    let str = '';
    let row = 'S.No,';

    row += headerList[0] + ',';
    row += headerList[1] + ',';
    row += headerList[2] + ',';
    row += ',';
    row += ',';
    row += ',';
    row += headerList[3] + ',';
    row += ',';
    row += ',';
    row += ',';
    row += headerList[4] + ',';
    row += ',';
    row += ',';
    row += ',';

    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = i + 1 + '';
      for (const index in headerList) {
        const head = headerList[index];

        if (typeof array[i][head] == 'object') {
          if (array[i][head] != null) {
            for (const index2 in headerList2) {
              const head2 = headerList2[index2];
              line += ',' + array[i][head][head2];
            }
          } else {
            line += ',' + 'null';
            line += ',' + 'null';
            line += ',' + 'null';
            line += ',' + 'null';
          }
        } else {
          line += ',' + array[i][head];
        }
      }
      str += line + '\r\n';
    }
    return str;
  }
}
