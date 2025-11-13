# 🚀 Guide de Démarrage Rapide - Budgetna

## Configuration Initiale

### 1. Cloner et installer

```bash
cd d:\Budgetna\ngx-admin
npm install
```

### 2. Configurer l'environnement

Vérifier `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8081',
};
```

### 3. Démarrer l'application

```bash
npm start
```

L'application sera accessible sur `http://localhost:4200`

## 🎯 Utiliser les Nouvelles Fonctionnalités

### State Management

```typescript
import { BudgetStateService } from './services/budget-state.service';

// Dans votre composant
constructor(private budgetState: BudgetStateService) {}

// Écouter les changements de budgets
this.budgetState.budgets$.subscribe(budgets => {
  console.log('Budgets mis à jour:', budgets);
});

// Ajouter un budget au state
this.budgetState.addBudget(newBudget);

// Obtenir les statistiques
const stats = this.budgetState.getBudgetStats();
console.log('Total budgets:', stats.totalBudgets);
console.log('Taux validation:', stats.tauxValidation);
```

### Notifications

```typescript
import { NotificationService } from './services/notification.service';

constructor(private notificationService: NotificationService) {}

// Notification personnalisée
this.notificationService.addNotification({
  type: 'success',
  title: 'Budget créé',
  message: 'Le budget a été créé avec succès',
  actionUrl: '/pages/budgets',
  actionLabel: 'Voir'
});

// Notifications prédéfinies
this.notificationService.notifyBudgetCreated('Budget Q1 2025');
this.notificationService.notifyBudgetValidated('Budget Q1 2025');

// Compteur de notifications non lues
this.notificationService.unreadCount$.subscribe(count => {
  console.log('Notifications non lues:', count);
});
```

### Dashboard

Accéder au dashboard via la route:

```
/pages/dashboard/budget-dashboard
```

## 🔧 Migration du Code Existant

### Avant (à éviter):

```typescript
// ❌ Ancien code avec reload
addBudget() {
  this.budgetService.ajouterBudget(budget).subscribe(() => {
    this._router.navigateByUrl('/pages/budgets')
      .then(() => window.location.reload());
  });
}
```

### Après (recommandé):

```typescript
// ✅ Nouveau code avec state management
addBudget() {
  this.budgetService.ajouterBudget(budget).subscribe(
    (result) => {
      // Mettre à jour le state
      this.budgetState.addBudget(result);

      // Notification
      this.notificationService.notifyBudgetCreated(result.name);

      // Toast
      this.toastrService.success('Budget créé avec succès', 'Succès');

      // Navigation (sans reload)
      this._router.navigate(['/pages/budgets']);
    },
    (error) => {
      // L'erreur est gérée par ErrorInterceptor
      console.error('Erreur:', error);
    }
  );
}
```

## 📊 Vérifier que tout fonctionne

### 1. Tester le State Management

```typescript
// Dans la console du navigateur
// Vérifier que les budgets sont dans le state
budgetState.budgets$.subscribe(b => console.log('Budgets:', b));
```

### 2. Tester les Notifications

Créer un budget et vérifier:

- Toast de succès apparaît ✅
- Notification ajoutée dans le centre de notifications ✅
- Badge du compteur mis à jour ✅

### 3. Tester le Dashboard

- Aller sur `/pages/dashboard/budget-dashboard`
- Vérifier que les KPIs s'affichent ✅
- Vérifier que les graphiques se chargent ✅

### 4. Tester la Gestion d'Erreurs

```typescript
// Forcer une erreur 401 (simulation)
// L'interceptor devrait:
// - Afficher un toast "Session expirée" ✅
// - Déconnecter l'utilisateur ✅
// - Rediriger vers /auth ✅
```

## 🐛 Résolution de Problèmes

### Problème: Les graphiques ne s'affichent pas

```bash
# Installer ngx-charts
npm install @swimlane/ngx-charts --save
```

Puis importer dans le module:

```typescript
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  imports: [NgxChartsModule]
})
```

### Problème: Erreurs TypeScript

```bash
# Nettoyer et rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Problème: Les toasts n'apparaissent pas

Vérifier que NbToastrModule est importé dans AppModule:

```typescript
import { NbToastrModule } from '@nebular/theme';

@NgModule({
  imports: [
    NbToastrModule.forRoot(),
  ]
})
```

## 📝 Checklist de Migration

- [ ] Remplacer `window.location.reload()` par state updates
- [ ] Ajouter `BudgetStateService` dans les composants
- [ ] Utiliser `NotificationService` pour les événements
- [ ] Remplacer les `alert()` par `NbToastrService`
- [ ] S'abonner aux observables avec `takeUntil` pour éviter les fuites mémoire
- [ ] Ajouter des indicateurs de chargement (`isLoading`)
- [ ] Gérer les erreurs de manière cohérente

## 🎓 Exemples de Code Complets

### Composant de Création de Budget

```typescript
import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BudgetService } from '../services/budget.service';
import { BudgetStateService } from '../services/budget-state.service';
import { NotificationService } from '../services/notification.service';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-create-budget',
  template: `
    <nb-card>
      <nb-card-header>Créer un Budget</nb-card-header>
      <nb-card-body>
        <form (ngSubmit)="onSubmit()">
          <!-- Formulaire -->
          <button nbButton status="primary" [disabled]="isLoading">
            <nb-spinner *ngIf="isLoading" size="small"></nb-spinner>
            Créer
          </button>
        </form>
      </nb-card-body>
    </nb-card>
  `,
})
export class CreateBudgetComponent implements OnDestroy {
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private budgetService: BudgetService,
    private budgetState: BudgetStateService,
    private notificationService: NotificationService,
    private toastrService: NbToastrService,
  ) {}

  onSubmit() {
    this.isLoading = true;

    this.budgetService
      .ajouterBudget(this.budget)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        result => {
          this.budgetState.addBudget(result);
          this.notificationService.notifyBudgetCreated(result.name);
          this.toastrService.success('Budget créé', 'Succès');
          this.isLoading = false;
        },
        error => {
          // Géré par l'interceptor
          this.isLoading = false;
        },
      );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## 🔗 Liens Utiles

- Documentation Angular: https://angular.io/docs
- Documentation Nebular: https://akveo.github.io/nebular/
- Guide RxJS: https://www.learnrxjs.io/

## 💡 Conseils Pro

1. **Toujours utiliser takeUntil** pour les souscriptions dans les composants
2. **Éviter les souscriptions imbriquées** - utiliser les opérateurs RxJS
3. **Utiliser le state service** comme source unique de vérité
4. **Tester régulièrement** - ne pas accumuler de dette technique
5. **Documenter les changements** dans le code avec des commentaires

---

Besoin d'aide? Consultez `IMPROVEMENTS.md` pour plus de détails.
