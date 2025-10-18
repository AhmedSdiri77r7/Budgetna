import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { Direction } from '../../../model/direction';
import { DirectionService } from '../../../services/direction.service';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}



@Component({
  selector: 'ngx-tree-grid',
  templateUrl: './tree-grid.component.html',
  styleUrls: ['./tree-grid.component.scss'],
})
export class TreeGridComponent {
  public directions: Direction[];
  customColumn = 'name';
  defaultColumns = [ 'users','direction', 'entreprise' , 'budgetInitials'];
  allColumns = [ this.customColumn, ...this.defaultColumns ];

  dataSource: NbTreeGridDataSource<Direction>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;
  directionService: any;

  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<Direction>, private DirectionsService: DirectionService) {
    this.dataSource = this.dataSourceBuilder.create(this.directions);
  }

  ngOnInit(): void {
    this.getDirection();
  }


  public getDirection(): void {
    this.directionService.getDirections().subscribe(
      (response: Direction[]) => {
        this.directions = response;
        console.log(this.directions);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }



  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }
}

@Component({
  selector: 'ngx-fs-icon',
  template: `
    <nb-tree-grid-row-toggle [expanded]="expanded" *ngIf="isDir(); else fileIcon">
    </nb-tree-grid-row-toggle>
    <ng-template #fileIcon>
      <nb-icon icon="file-text-outline"></nb-icon>
    </ng-template>
  `,
})
export class FsIconComponent {
  @Input() kind: string;
  @Input() expanded: boolean;

  isDir(): boolean {
    return this.kind === 'dir';
  }
}
