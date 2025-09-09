# 🎨 Composants UI - Iven

Ce dossier contient le **Design System** de l'application Iven, organisé selon les principes de l'**Atomic Design**.

## 📁 Structure des composants

### **Atoms** - Composants de base
Composants atomiques, les plus petits éléments réutilisables :

- **`Avatar.tsx`** - Avatar utilisateur avec différentes tailles
- **`Badge.tsx`** - Badges/étiquettes colorées
- **`Text.tsx`** - Composant de texte avec variantes et thème
- **`Divider.tsx`** - Séparateurs horizontaux et verticaux
- **`Spinner.tsx`** - Indicateur de chargement animé

### **Molecules** - Composants composés
Composants qui combinent plusieurs atoms :

- **`SearchBar.tsx`** - Barre de recherche avec icônes et actions
- **`EmptyState.tsx`** - État vide avec icône, titre et action
- **`LoadingOverlay.tsx`** - Overlay de chargement modal ou plein écran
- **`TaskFilters.tsx`** - Filtres pour les tâches
- **`TaskStats.tsx`** - Statistiques des tâches
- **`TaskHeader.tsx`** - En-tête de la page des tâches
- **`TaskList.tsx`** - Liste des tâches
- **`EventInvitations.tsx`** - Invitations aux événements

### **Organisms** - Composants complexes
Composants qui combinent plusieurs molecules :

- **`Header.tsx`** - En-tête de page avec titre et actions

### **Templates** - Layouts réutilisables ✨ NOUVEAU
Templates pour créer des layouts cohérents :

- **`PageLayout.tsx`** - Layout de page standard avec header et contenu
- **`ModalLayout.tsx`** - Layout de modale avec header et contenu
- **`TabLayout.tsx`** - Layout avec navigation par onglets

### **Composants spécifiques**
Composants utilitaires et spécialisés :

- **`Button.tsx`** - Boutons avec variantes et thème
- **`Card.tsx`** - Cartes avec variantes et padding
- **`Input.tsx`** - Champs de saisie configurables
- **`DatePicker.tsx`** - Sélecteur de date
- **`TimePicker.tsx`** - Sélecteur d'heure
- **`ProgressBar.tsx`** - Barre de progression avec labels
- **`ErrorText.tsx`** - Affichage d'erreurs
- **`ToggleTheme.tsx`** - Basculement thème clair/sombre

### **Composants de navigation**
Composants pour la navigation et l'interface :

- **`TopBar.tsx`** - Barre supérieure générique
- **`BottomBar.tsx`** - Navigation par onglets
- **`AccountActivationBanner.tsx`** - Bannière d'activation de compte

## 🚀 Utilisation

### Import depuis l'index UI
```typescript
import { 
  Button, 
  Card, 
  Text, 
  Avatar,
  SearchBar,
  EmptyState,
  LoadingOverlay,
  ProgressBar,
  PageLayout,
  ModalLayout,
  TabLayout
} from '../../components/ui';
```

### Import depuis l'index principal
```typescript
import { 
  Button, 
  Card, 
  Text,
  PageLayout,
  ModalLayout
} from '../../components';
```

### Import direct
```typescript
import Button from '../../components/ui/Button';
import Text from '../../components/ui/atoms/Text';
import PageLayout from '../../components/ui/templates/PageLayout';
```

## 🎯 Nouveautés de l'Architecture

### **Templates de Layout**
Les templates garantissent une cohérence visuelle dans toute l'application :

#### **PageLayout** - Pour les pages standard
```tsx
import { PageLayout } from '../../components/ui/templates';

export default function MaPage() {
  return (
    <PageLayout 
      title="Titre de la page"
      showBackButton={true}
      onBackPress={() => navigation.goBack()}
    >
      {/* Contenu de la page */}
    </PageLayout>
  );
}
```

#### **ModalLayout** - Pour les modales
```tsx
import { ModalLayout } from '../../components/ui/templates';

export default function MaModale() {
  const [visible, setVisible] = useState(false);
  
  return (
    <ModalLayout
      visible={visible}
      onClose={() => setVisible(false)}
      title="Titre de la modale"
    >
      {/* Contenu de la modale */}
    </ModalLayout>
  );
}
```

#### **TabLayout** - Pour les pages avec onglets
```tsx
import { TabLayout } from '../../components/ui/templates';

export default function MaPageAvecOnglets() {
  const tabs = [
    {
      id: 'tab1',
      title: 'Onglet 1',
      content: <ContenuOnglet1 />
    },
    {
      id: 'tab2',
      title: 'Onglet 2',
      content: <ContenuOnglet2 />
    }
  ];
  
  return <TabLayout tabs={tabs} defaultTab="tab1" />;
}
```

## 🔄 Migration depuis l'Ancienne Architecture

### **Avant**
```tsx
import EventCard from '../../components/ui/EventCard';
import TaskCard from '../../components/ui/TaskCard';
```

### **Après**
```tsx
// Composants métier (déplacés vers features/)
import { EventCard } from '../../components/features/events';
import { TaskCard } from '../../components/features/tasks';

// Composants UI (restent ici)
import { Button, Card, Text } from '../../components/ui';
```

## 📚 Documentation Complète

Pour plus de détails sur la nouvelle architecture complète, consultez :
- **`NOUVELLE_ARCHITECTURE_COMPOSANTS.md`** - Vue d'ensemble complète
- **`ArchitectureDemo.tsx`** - Composant de démonstration

## 🎉 Bénéfices

- 🎨 **Interface cohérente** avec les templates de layout
- 🔧 **Maintenance simplifiée** avec organisation claire
- 📦 **Réutilisabilité** maximale des composants
- 🚀 **Développement plus rapide** avec composants prêts à l'emploi
