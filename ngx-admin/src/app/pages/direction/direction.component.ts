import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Direction } from '../../model/direction';
import { DirectionService } from '../../services/direction.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { AddDirectionComponent } from './add-direction/add-direction.component';
import { UpdateDirectionComponent } from './update-direction/update-direction.component';

@Component({
  selector: 'ngx-direction',
  templateUrl: './direction.component.html',
  styleUrls: ['./direction.component.scss']
})
export class DirectionComponent implements OnInit {
  listDirections: Direction[] = [];
  originalDirections: Direction[] = []; // Store original data for search reset
  search: string = '';
  groupedDirections: { [key: string]: Direction[] } = {};
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private directionService: DirectionService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadDirections();
  }

  loadDirections(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.directionService.getDirections().subscribe({
      next: (data) => {
        this.listDirections = data;
        this.originalDirections = [...data];
        this.groupDirectionsByEntreprise();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load directions. Please try again.';
        if (err.status === 401 || err.status === 403) {
          this.tokenStorage.signOut();
          this.router.navigateByUrl('/auth');
        }
      }
    });
  }

  groupDirectionsByEntreprise(): void {
    this.groupedDirections = this.listDirections.reduce((acc, direction) => {
      const entrepriseName = direction.entreprise?.name || 'Unknown';
      if (!acc[entrepriseName]) {
        acc[entrepriseName] = [];
      }
      acc[entrepriseName].push(direction);
      return acc;
    }, {} as { [key: string]: Direction[] });
  }

  onOpenDialogClick(): void {
    this.matDialog.open(AddDirectionComponent).afterClosed().subscribe((result) => {
      if (result) {
        this.loadDirections(); // Refresh data after adding
      }
    });
  }

  deleteDirection(id: number): void {
    if (confirm('Are you sure you want to delete this direction?')) {
      this.directionService.deleteDirection(id).subscribe({
        next: () => this.loadDirections(),
        error: (err) => {
          this.errorMessage = 'Failed to delete direction. Please try again.';
          if (err.status === 401 || err.status === 403) {
            this.tokenStorage.signOut();
            this.router.navigateByUrl('/auth');
          }
        }
      });
    }
  }

  searchfct(): void {
    if (!this.search.trim()) {
      this.listDirections = [...this.originalDirections];
    } else {
      this.listDirections = this.originalDirections.filter((res) =>
        res.name.toLowerCase().includes(this.search.toLowerCase()) ||
        res.entreprise?.name.toLowerCase().includes(this.search.toLowerCase())
      );
    }
    this.groupDirectionsByEntreprise(); // Update grouped data
  }

  updateDirection(id: number): void {
    const direction = this.listDirections.find((d) => d.id === id);
    if (direction) {
      this.matDialog.open(UpdateDirectionComponent, {
        data: { direction }
      }).afterClosed().subscribe((result) => {
        if (result) {
          this.loadDirections(); // Refresh data after updating
        }
      });
    }
  }

  exportAsXLSX(): void {
    this.downloadFile(this.listDirections, 'directions');
  }

  downloadFile(data: any[], filename: string): void {
    const csvData = this.convertToCSV(data, ['id', 'name', 'budgetInitials', 'budgetRevise', 'entreprise']);
    const blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    const dwldLink = document.createElement('a');
    const url = URL.createObjectURL(blob);
    dwldLink.setAttribute('href', url);
    dwldLink.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  convertToCSV(objArray: any[], headerList: string[]): string {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    const headers = ['S.No', ...headerList.map((h) => (h === 'entreprise' ? 'entreprise.name' : h))];
    let str = headers.join(',') + '\r\n';

    array.forEach((item, index) => {
      let line = `${index + 1}`;
      headerList.forEach((head) => {
        let value = head === 'entreprise' ? item[head]?.name || 'null' : item[head] ?? 'null';
        line += `,${value}`;
      });
      str += line + '\r\n';
    });

    return str;
  }
}