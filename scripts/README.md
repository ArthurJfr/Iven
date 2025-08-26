# 🚀 Scripts de Migration des Composants

Ce dossier contient les scripts pour migrer automatiquement les composants vers la nouvelle architecture.

---

## 📋 **Scripts Disponibles**

### **1. `migrate-imports.js` - Migration Automatisée**
Migre automatiquement tous les imports de composants vers la nouvelle architecture.

```bash
npm run migrate
# ou
node scripts/migrate-imports.js
```

**Ce que fait ce script :**
- ✅ Remplace `import EventCard from '.../components/ui/EventCard'` par `import { EventCard } from '.../components/features/events'`
- ✅ Remplace `import TaskCard from '.../components/ui/TaskCard'` par `import { TaskCard } from '.../components/features/tasks'`
- ✅ Remplace `import AccountActivationBanner from '.../components/ui/AccountActivationBanner'` par `import { AccountActivationBanner } from '.../components/features/auth'`
- ✅ Remplace `import LoadingOverlay from '.../components/ui/molecules/LoadingOverlay'` par `import { LoadingOverlay } from '.../components/shared'`
- ✅ Remplace `import EmptyState from '.../components/ui/molecules/EmptyState'` par `import { EmptyState } from '.../components/shared'`

### **2. `verify-migration.js` - Vérification**
Vérifie que tous les composants sont correctement migrés.

```bash
npm run verify-migration
# ou
node scripts/verify-migration.js
```

**Ce que fait ce script :**
- 🔍 Analyse tous les fichiers `.tsx` et `.ts`
- 📊 Identifie les imports qui nécessitent une migration
- ✅ Confirme que les composants UI restent en place
- 📋 Génère un rapport détaillé

---

## 🎯 **Utilisation Recommandée**

### **Étape 1 : Migration Automatisée**
```bash
npm run migrate
```

### **Étape 2 : Vérification**
```bash
npm run verify-migration
```

### **Étape 3 : Test de l'Application**
```bash
npm start
```

---

## 📁 **Structure des Composants Après Migration**

```
components/
├── ui/                           # Design System (Atomic Design)
│   ├── atoms/                    # Composants de base
│   ├── molecules/                # Composants composés
│   ├── organisms/                # Composants complexes
│   └── templates/                # Layouts réutilisables
├── features/                     # Composants par fonctionnalité
│   ├── events/                   # Composants événements
│   ├── tasks/                    # Composants tâches
│   └── auth/                     # Composants authentification
├── shared/                       # Composants partagés
└── index.ts                      # Export principal
```

---

## 🔄 **Règles de Migration**

### **Composants Migrés vers Features**
- `EventCard` → `components/features/events`
- `TaskCard` → `components/features/tasks`
- `AccountActivationBanner` → `components/features/auth`

### **Composants Migrés vers Shared**
- `LoadingOverlay` → `components/shared`
- `EmptyState` → `components/shared`

### **Composants UI (Restent en Place)**
- `Button`, `Card`, `Text`, `Avatar`, `Badge`
- `Input`, `DatePicker`, `TimePicker`
- `Header`, `TopBar`, `BottomBar`

---

## 🧪 **Test de la Migration**

### **1. Vérifier les Imports**
```bash
npm run verify-migration
```

### **2. Tester l'Application**
```bash
npm start
```

### **3. Utiliser le Composant de Démonstration**
```tsx
import ArchitectureDemo from '../../components/ArchitectureDemo';

export default function TestPage() {
  return <ArchitectureDemo />;
}
```

---

## 🚨 **En Cas de Problème**

### **Problème : Erreurs d'Import**
```bash
# Vérifier la migration
npm run verify-migration

# Relancer la migration si nécessaire
npm run migrate
```

### **Problème : Composants Non Trouvés**
1. Vérifier que les composants existent dans les bons dossiers
2. Vérifier les exports dans les fichiers `index.ts`
3. Relancer la migration

### **Problème : Erreurs TypeScript**
1. Vérifier que tous les types sont correctement exportés
2. Vérifier les imports dans `types/index.ts`
3. Relancer `npm start` pour recompiler

---

## 📚 **Documentation Complète**

- **`MIGRATION_COMPOSANTS.md`** - Guide détaillé de migration
- **`NOUVELLE_ARCHITECTURE_COMPOSANTS.md`** - Vue d'ensemble de la nouvelle architecture
- **`components/ui/README.md`** - Documentation des composants UI

---

## 🎉 **Bénéfices de la Migration**

- 🎯 **Imports plus clairs** et organisés
- 🔍 **Trouver facilement** les composants par fonctionnalité
- 📚 **Documentation** intégrée dans la structure
- 🔄 **Maintenance simplifiée** par domaine
- 🏗️ **Architecture évolutive** et professionnelle

---

## 🚀 **Prochaines Étapes**

1. ✅ **Migrer** tous les composants
2. ✅ **Vérifier** la migration
3. ✅ **Tester** l'application
4. 🔄 **Utiliser** la nouvelle architecture pour le développement
5. 🎯 **Maintenir** la cohérence de l'architecture
