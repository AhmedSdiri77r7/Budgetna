# 🚀 Commandes Rapides - Budgetna

## Développement

### Démarrer l'application

```bash
npm start
```

→ Ouvre sur `http://localhost:4200`

### Build de production

```bash
npm run build:prod
```

→ Optimisé, AOT compilé, prêt pour déploiement

---

## Tests & Qualité

### Lancer les tests unitaires

```bash
npm test
```

### Tests avec coverage

```bash
npm run test:coverage
```

→ Rapport dans `coverage/`

### Lint (vérification code)

```bash
npm run lint
```

### Lint + correction auto

```bash
npm run lint:fix
```

### Lint styles (SCSS)

```bash
npm run lint:styles
```

### Format code (Prettier)

```bash
npm run format
```

### Vérifier format sans modifier

```bash
npm run format:check
```

---

## Documentation

### Générer la documentation

```bash
npm run docs
```

### Documentation + serveur local

```bash
npm run docs:serve
```

→ Ouvre sur `http://localhost:8080`

---

## Git & Workflow

### Créer une branche feature

```bash
git checkout -b feature/nom-de-la-feature
```

### Commit (suivre Conventional Commits)

```bash
git commit -m "feat: ajout dashboard budgétaire"
git commit -m "fix: correction erreur 401"
git commit -m "docs: mise à jour README"
git commit -m "refactor: amélioration state management"
```

### Pousser et créer PR

```bash
git push origin feature/nom-de-la-feature
```

---

## Debugging

### Nettoyer node_modules

```bash
rm -rf node_modules package-lock.json
npm install
```

### Nettoyer cache Angular

```bash
npm run clean
# Ou manuellement:
rm -rf .angular
```

### Rebuild complet

```bash
npm run clean
npm install
npm run build:prod
```

---

## Production

### Build optimisé

```bash
npm run build:prod
```

### Analyser la taille du bundle

```bash
npm run build:prod -- --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

### Preview build de production localement

```bash
npm run build:prod
npx http-server dist -p 8080
```

---

## Base de Données (Backend)

### Importer le schéma SQL

```bash
mysql -u root -p budgetna < bpdbackend.sql
```

### Connexion MySQL

```bash
mysql -u root -p budgetna
```

---

## Raccourcis Utiles

### Tout vérifier avant commit

```bash
npm run lint && npm test && npm run build:prod
```

### Pipeline CI locale

```bash
npm run lint:ci && npm run test:coverage
```

### Tout nettoyer et réinstaller

```bash
rm -rf node_modules package-lock.json dist .angular
npm install
```

---

## Environnements

### Développement (par défaut)

```bash
npm start
# Utilise src/environments/environment.ts
```

### Production

```bash
npm run build:prod
# Utilise src/environments/environment.prod.ts
```

---

## Serveur Backend (si séparé)

### Démarrer le backend Spring Boot

```bash
cd ../backend
mvn spring-boot:run
```

### Ou avec Java directement

```bash
java -jar target/budgetna-backend.jar
```

---

## Docker (si configuré)

### Build image

```bash
docker build -t budgetna-frontend .
```

### Run container

```bash
docker run -p 4200:80 budgetna-frontend
```

### Docker Compose (full stack)

```bash
docker-compose up -d
```

---

## Monitoring & Logs

### Voir les logs en temps réel

```bash
# Dans Chrome DevTools
# Console → Voir les logs de l'app

# Ou avec Augury (extension Chrome)
```

### Performance Lighthouse

```bash
# Dans Chrome DevTools
# Lighthouse → Générer rapport
```

---

## Déploiement

### Déployer sur Firebase Hosting

```bash
npm run build:prod
firebase deploy
```

### Déployer sur Netlify

```bash
npm run build:prod
netlify deploy --prod
```

### Déployer sur Vercel

```bash
vercel --prod
```

---

## Utilitaires

### Mettre à jour Angular

```bash
ng update @angular/cli @angular/core
```

### Mettre à jour Nebular

```bash
ng update @nebular/theme
```

### Vérifier versions

```bash
ng version
npm outdated
```

### Installer nouvelle dépendance

```bash
npm install package-name --save
# Ou dev dependency
npm install package-name --save-dev
```

---

## Troubleshooting Rapide

### Port 4200 déjà utilisé

```bash
# Changer le port
ng serve --port 4300
```

### Erreur "Cannot find module"

```bash
npm install
```

### Erreur de compilation TypeScript

```bash
# Vérifier tsconfig.json
# Nettoyer et rebuild
rm -rf dist .angular
ng build
```

### Erreur de style (SCSS)

```bash
npm run lint:styles
```

---

## Scripts Package.json (Référence)

```json
{
  "start": "ng serve",
  "build": "ng build",
  "build:prod": "ng build --configuration production --aot",
  "test": "ng test",
  "test:coverage": "ng test --code-coverage",
  "lint": "ng lint",
  "lint:fix": "ng lint --fix",
  "lint:styles": "stylelint ./src/**/*.scss",
  "format": "prettier --write \"src/**/*.{ts,html,scss,json}\"",
  "format:check": "prettier --check \"src/**/*.{ts,html,scss,json}\"",
  "docs": "compodoc -p src/tsconfig.app.json -d docs",
  "docs:serve": "compodoc -p src/tsconfig.app.json -d docs -s"
}
```

---

## Aide Mémoire Git

```bash
# Status
git status

# Voir les changements
git diff

# Ajouter fichiers
git add .

# Commit
git commit -m "message"

# Pousser
git push

# Récupérer derniers changements
git pull

# Voir l'historique
git log --oneline

# Créer branche
git checkout -b feature/nom

# Changer de branche
git checkout main

# Merger
git merge feature/nom

# Annuler dernier commit (garder changements)
git reset --soft HEAD~1

# Annuler tous les changements locaux
git reset --hard HEAD
```

---

## Variables d'Environnement

### Development

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8081',
};
```

### Production

```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiBaseUrl: 'https://api.budgetna.com',
};
```

---

**💡 Astuce:** Ajouter ces commandes à vos alias bash/zsh pour gagner du temps!

```bash
# Dans ~/.bashrc ou ~/.zshrc
alias ng-start="npm start"
alias ng-build="npm run build:prod"
alias ng-test="npm run test:coverage"
alias ng-lint="npm run lint:fix"
alias ng-clean="rm -rf node_modules package-lock.json && npm install"
```
