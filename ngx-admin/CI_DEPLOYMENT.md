# Migration CI/CD - Guide de déploiement

## ✅ Fichiers créés

### Workflows GitHub Actions
1. **`.github/workflows/ci.yml`** - Pipeline CI principal
   - Tests sur Node 14.x et 16.x
   - Lint (TypeScript + SCSS)
   - Tests unitaires avec couverture
   - Build production
   - Upload artifacts

2. **`.github/workflows/lint-pr.yml`** - Linter pour Pull Requests
   - Annotations inline sur les PRs
   - Check formatage Prettier

3. **`.github/workflows/README.md`** - Documentation complète

### Configuration
- **`karma.conf.js`** - Ajout launcher `ChromeHeadlessCI` pour CI

## 🚀 Prochaines étapes pour activer la CI

### Étape 1: Formater le code (optionnel mais recommandé)
```bash
# Formater automatiquement tous les fichiers
npm run format

# Vérifier ce qui sera formaté
npm run format:check
```

### Étape 2: Commit et push
```bash
# Ajouter les nouveaux fichiers
git add .github/ karma.conf.js .eslintrc.json .prettierrc.json .prettierignore .vscode/

# Commit
git commit -m "feat: Add CI/CD pipeline with ESLint, Prettier and GitHub Actions

- Migrate from TSLint to ESLint (@angular-eslint)
- Add Prettier for code formatting
- Add GitHub Actions workflows (ci.yml, lint-pr.yml)
- Configure ChromeHeadlessCI for tests
- Update VS Code settings and extensions"

# Push vers GitHub
git push origin main
```

### Étape 3: Vérifier dans GitHub
1. Aller sur https://github.com/AhmedSdiri77r7/Budgetna
2. Cliquer sur l'onglet **Actions**
3. Voir le workflow "CI" s'exécuter automatiquement

## 📊 Ce que la CI va faire

### À chaque push sur `main` ou `develop`:
1. ✅ Installer les dépendances
2. 🔍 Vérifier le code avec ESLint
3. 🎨 Vérifier les styles SCSS
4. 📝 Vérifier le formatage Prettier
5. 🧪 Lancer les tests unitaires
6. 📦 Builder la version production
7. 💾 Sauvegarder le build (artifacts)

### À chaque Pull Request:
- Annotations automatiques des erreurs ESLint dans les fichiers modifiés
- Vérification du formatage

## ⚙️ Configuration optionnelle

### Codecov (couverture de code)
1. Créer un compte sur https://codecov.io
2. Ajouter le secret `CODECOV_TOKEN` dans GitHub Settings > Secrets
3. Le workflow uploadera automatiquement la couverture

### Badge de statut
Ajouter dans `README.md`:
```markdown
![CI](https://github.com/AhmedSdiri77r7/Budgetna/workflows/CI/badge.svg)
```

## 🐛 Troubleshooting

**Les tests échouent en CI:**
```bash
# Tester localement avec le même environnement
npm run test:coverage -- --watch=false --browsers=ChromeHeadlessCI
```

**Le linting échoue:**
```bash
# Auto-fixer les problèmes
npm run lint:fix
npm run format
```

**Le build échoue:**
```bash
# Tester le build de production localement
npm run build:prod
```

## 📝 Notes

- Les workflows utilisent `npm ci` (plus rapide et déterministe que `npm install`)
- La CI conserve les artifacts de build pendant 7 jours
- Le workflow teste sur 2 versions de Node (14.x et 16.x) pour garantir la compatibilité

---

**Status**: ✅ Configuration terminée, prêt à commit !
