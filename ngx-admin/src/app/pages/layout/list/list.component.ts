import { Component, OnInit, OnDestroy } from '@angular/core';
import { Employe } from '../../../model/employe';
import { Direction } from '../../../model/direction';
import { DirectionService } from '../../../services/direction.service';
import { EmployeService } from '../../../services/employe.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../../services/token-storage.service';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.scss', 'list.component.css'],
})
export class ListComponent implements OnInit, OnDestroy {
  // Structure pour stocker les données hiérarchiques
  structuredData: Map<
    string,
    {
      entreprise: string;
      directions: Map<
        number,
        {
          direction: Direction;
          employes: Employe[];
        }
      >;
    }
  > = new Map();

  filteredData: Map<
    string,
    {
      entreprise: string;
      directions: Map<
        number,
        {
          direction: Direction;
          employes: Employe[];
        }
      >;
    }
  > = new Map();

  // UI States
  initialLoading = true;
  loadingMore = false;
  error: string = '';
  page = 1;
  pageSize = 10;
  hasMoreData = true;

  // Filters
  searchTerm: string = '';
  statusFilter: string = 'all';
  sortBy: string = 'name';
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private tokenStorage: TokenStorageService,
    private employeService: EmployeService,
    private serviceDirection: DirectionService,
    private _router: Router,
  ) {
    // Configure search debounce
    this.searchSubject.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe(() => {
      this.onSearch();
    });
  }

  ngOnInit(): void {
    this.loadStructuredData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadStructuredData(): void {
    this.initialLoading = true;
    this.error = '';

    this.serviceDirection.getDirections().subscribe(
      (directions: Direction[]) => {
        // Grouper par entreprise d'abord
        directions.forEach(direction => {
          const entrepriseName = direction.entreprise?.name || 'Sans entreprise';

          if (!this.structuredData.has(entrepriseName)) {
            this.structuredData.set(entrepriseName, {
              entreprise: entrepriseName,
              directions: new Map(),
            });
          }

          const entrepriseData = this.structuredData.get(entrepriseName);
          entrepriseData.directions.set(direction.id, {
            direction: direction,
            employes: [],
          });

          // Charger les employés pour cette direction
          this.loadEmployesForDirection(direction.id, entrepriseName);
        });

        // Initialize filtered data
        this.applyFilters();
      },
      error => {
        console.error('Erreur lors du chargement des directions:', error);
        this.error = 'Erreur lors du chargement des directions. Veuillez réessayer.';
        this.initialLoading = false;
        if (error.status === 401) {
          this._router.navigateByUrl('/auth');
          this.tokenStorage.signOut();
        }
      },
    );
  }

  private loadEmployesForDirection(directionId: number, entrepriseName: string): void {
    this.employeService.getEmployerByDirection(directionId).subscribe(
      (employes: Employe[]) => {
        if (this.structuredData.has(entrepriseName)) {
          const entrepriseData = this.structuredData.get(entrepriseName);
          if (entrepriseData.directions.has(directionId)) {
            entrepriseData.directions.get(directionId).employes = employes;
          }
        }

        this.initialLoading = false;
        this.applyFilters();
      },
      error => {
        console.error(`Erreur lors du chargement des employés pour la direction ${directionId}:`, error);
        this.error = 'Erreur lors du chargement des employés. Veuillez réessayer.';
        this.initialLoading = false;
        if (error.status === 401) {
          this._router.navigateByUrl('/auth');
          this.tokenStorage.signOut();
        }
      },
    );
  }

  // UI Event Handlers
  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  onScroll(): void {
    if (this.hasMoreData && !this.loadingMore) {
      this.page++;
      this.loadMoreData();
    }
  }

  retryLoading(): void {
    this.error = '';
    this.loadStructuredData();
  }

  refreshData(): void {
    this.page = 1;
    this.hasMoreData = true;
    this.structuredData.clear();
    this.filteredData.clear();
    this.loadStructuredData();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.sortBy = 'name';
    this.applyFilters();
  }

  // Tracking function for ngFor
  trackByFn(index: number, item: any): any {
    return item.key;
  }

  // Private helper methods
  private applyFilters(): void {
    this.filteredData.clear();

    // Create a new filtered map based on search and filters
    for (const [entrepriseName, data] of this.structuredData) {
      if (this.matchesFilters(entrepriseName, data)) {
        this.filteredData.set(entrepriseName, { ...data });
      }
    }

    // Apply sorting
    this.sortFilteredData();
  }

  private matchesFilters(
    entrepriseName: string,
    data: {
      entreprise: string;
      directions: Map<
        number,
        {
          direction: Direction;
          employes: Employe[];
        }
      >;
    },
  ): boolean {
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      const matchesSearch =
        entrepriseName.toLowerCase().includes(searchLower) ||
        Array.from(data.directions.values()).some(
          dir =>
            dir.direction.name.toLowerCase().includes(searchLower) ||
            dir.employes.some(
              emp =>
                (emp.nom + ' ' + emp.prenom).toLowerCase().includes(searchLower) ||
                emp.role.toLowerCase().includes(searchLower),
            ),
        );

      if (!matchesSearch) return false;
    }

    if (this.statusFilter !== 'all') {
      const hasMatchingStatus = Array.from(data.directions.values()).some(dir =>
        dir.employes.some(emp => emp.status === this.statusFilter),
      );

      if (!hasMatchingStatus) return false;
    }

    return true;
  }

  private sortFilteredData(): void {
    const sortedEntries = Array.from(this.filteredData.entries()).sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a[0].localeCompare(b[0]);
        case 'employees':
          const aCount = this.getTotalEmployees(a[1]);
          const bCount = this.getTotalEmployees(b[1]);
          return bCount - aCount;
        case 'created':
          // Assuming there's a creation date in the data
          return 0; // Implement actual date comparison if available
        default:
          return 0;
      }
    });

    this.filteredData = new Map(sortedEntries);
  }

  private getTotalEmployees(data: {
    entreprise: string;
    directions: Map<
      number,
      {
        direction: Direction;
        employes: Employe[];
      }
    >;
  }): number {
    return Array.from(data.directions.values()).reduce((total, dir) => total + dir.employes.length, 0);
  }

  private loadMoreData(): void {
    // Implement pagination logic here if needed
    this.loadingMore = true;
    // Simulate API call
    setTimeout(() => {
      this.loadingMore = false;
      this.hasMoreData = false; // Set to true if more data is available
    }, 1000);
  }
}
