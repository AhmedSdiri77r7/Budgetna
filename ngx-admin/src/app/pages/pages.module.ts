import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { EntrepriseComponent } from './entreprise/entreprise.component';
import { AddEntrepriseComponent } from './entreprise/add-entreprise/add-entreprise.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { UpdateEntrepriseComponent } from './entreprise/update-entreprise/update-entreprise.component';
import { DirectionComponent } from './direction/direction.component';
import { ContratComponent } from './contrat/contrat.component';
import { AddContratComponent } from './contrat/add-contrat/add-contrat.component';
import { UpdateContratComponent } from './contrat/update-contrat/update-contrat.component';
import { EmployeComponent } from './employe/employe.component';
import { AddDirectionComponent } from './direction/add-direction/add-direction.component';
import { AddEmployeComponent } from './employe/add-employe/add-employe.component';
import { UpdateEmployeComponent } from './employe/update-employe/update-employe.component';
import { UpdateDirectionComponent } from './direction/update-direction/update-direction.component';
import { CompteAnalytiqueComponent } from './compte-analytique/compte-analytique.component';
import { AddCompteAnalytiqueComponent } from './compte-analytique/add-compte-analytique/add-compte-analytique.component';
import { UpdateCompteAnalytiqueComponent } from './compte-analytique/update-compte-analytique/update-compte-analytique.component';
import { ChartModule } from 'angular2-chartjs';
import { BudgetReviseComponent } from './compte-analytique/budget-revise/budget-revise.component';


@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    MatDialogModule,
    FormsModule,
    ChartModule,
    
  ],
  declarations: [
    PagesComponent,
    EntrepriseComponent,
    AddEntrepriseComponent,
    UpdateEntrepriseComponent,
    DirectionComponent,
    ContratComponent,
    AddContratComponent,
    UpdateContratComponent,
    EmployeComponent,
    AddDirectionComponent,
    AddEmployeComponent,
    UpdateEmployeComponent,
    UpdateDirectionComponent,
    CompteAnalytiqueComponent,
    AddCompteAnalytiqueComponent,
    UpdateCompteAnalytiqueComponent,
    BudgetReviseComponent,
  ],
})
export class PagesModule {
}
