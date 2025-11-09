# GitHub Copilot Instructions for Budgetna (ngx-admin customization)

These guidelines help AI coding agents work effectively in this Angular 12 + Nebular admin dashboard fork.
Keep responses concise and follow established patterns.

## Architecture Overview
- Root Angular app: `AppModule` (`src/app/app.module.ts`) imports Nebular modules, theme & core modules.
- Feature areas grouped under `src/app/pages/*` (e.g. `entreprise`, `direction`, `employe`, `contrat`, `budget`). Each folder usually has components + routing (check `pages-routing.module.ts`).
- Shared cross-cutting code:
  - `@core` (services, data providers, mock data).
  - `@theme` (Nebular theme module, components, styles, layouts, pipes).
- Services in `src/app/services/*` handle HTTP calls to backend using `environment.apiBaseUrl`.
- Models in `src/app/model/*` are simple TypeScript classes/interfaces for payloads.
- Authentication: `auth.interceptor.ts` injects Bearer token from `TokenStorageService` into requests; guarded routes via `auth.guard.ts`.

## Conventions & Patterns
- Component selectors use prefix `ngx-` per `angular.json` schematics & `tslint.json` rules.
- Styling: SCSS with global theme entry `src/app/@theme/styles/styles.scss` imported via `angular.json`.
- HTTP services: Use `HttpClient`. Always include Authorization header using template literal: `new HttpHeaders().set('Authorization', \
  \`Bearer ${token}\`)` (recent fix in `budget.service.ts`). Avoid hardcoding token in URL unless backend explicitly requires (refactor toward headers).
- Date formatting pattern central helper inside a service (e.g. `formatDate` in `budget.service.ts`). Prefer `toISOString().substring(0,10)` if adding new.
- Events between components sometimes via `EventEmitter` on services (`BudgetService.$eventEmit`). Prefer RxJS `Subject` for new patterns but keep existing for backward compatibility.
- Error handling: redirect to `/auth` and `signOut()` on 401 (see budget service & interceptor). Replicate this pattern for secure endpoints.
- Use `encodeURIComponent` when passing free-text in URL segments (see `validerBudget`).

## Build & Scripts
- Run dev server: `npm start` (wraps `ng serve`). Node 14.14+ required.
- Production build: `npm run build:prod` (AOT + prod configuration).
- Tests: `npm test` (Karma + Jasmine). Coverage: `npm run test:coverage`.
- Lint (TSLint + Stylelint): `npm run lint`, fix: `npm run lint:fix`, styles: `npm run lint:styles`.
- Docs generation: `npm run docs:serve` (Compodoc). Use it to explore component/service structure before large refactors.

## Adding Features
- Generate components with prefix `ngx` and style `scss` to satisfy selector/style rules.
- Place new domain models in `src/app/model/` and related HTTP logic in a dedicated `*.service.ts` inside `src/app/services/`.
- If service requires auth, inject `TokenStorageService` and follow interceptor pattern (DO NOT duplicate token logic in each method; rely on interceptor unless backend needs dynamic token path parameter).
- Reuse existing environment configuration; don't introduce new global constants outside `environment.ts`.

## Testing Approach
- Use Jasmine + Karma; existing specs minimal. When adding tests:
  - Service tests: import `HttpClientTestingModule`, mock backend responses.
  - Guards/interceptors: test redirect & header injection.
  - Keep test file naming: `*.spec.ts` adjacent to source.

## Performance & Optimization
- Current `angular.json` dev options disable optimization & buildOptimizer. For performance-sensitive changes, test with `npm run build:prod`.
- Avoid large bundle CommonJS warnings: prefer ES modules if updating libraries (see `allowedCommonJsDependencies`).

## Common Pitfalls
- Incorrect header interpolation (fixed) — ensure backticks, not quotes with `${token}` literal.
- Passing tokens in URL segments (`ajouterBudget`)—prefer headers; refactor gradually.
- Hardcoded Google Maps key in `AppModule` chat config; store future secrets in environment files.

## Migration Targets (If Contributing Substantially)
- TSLint is deprecated; future migration path: ESLint (`@angular-eslint`). Keep current rules until migration planned.
- Protractor e2e outdated; consider Cypress/Playwright for new e2e tests.

## Safe Refactor Guidelines
- Introduce adapter methods rather than renaming existing service methods consumed across multiple components.
- Preserve public method signatures when adding optional parameters (use interface + partials).
- Validate token-dependent calls with 401 flow intact.

## Example Pattern
```ts
// New secure GET service method template
getEntities(): Observable<Entity[]> {
  return this.http.get<Entity[]>(`${this.apiServerUrl}/entities`).pipe(
    catchError(err => {
      if (err.status === 401) { this.tokenStorage.signOut(); this._router.navigateByUrl('/auth'); }
      return throwError(err);
    })
  );
}
```

## When Unsure
Prefer reading similar existing service (e.g., `budget.service.ts`) and mirror error + event patterns. Use Compodoc for structure discovery. Ask for backend contract if endpoint pattern diverges from REST style.

---
Feedback welcome: suggest clarifications or additional patterns to add.
