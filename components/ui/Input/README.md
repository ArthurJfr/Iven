# Composant Input

Un composant Input hautement personnalisable et thématisé pour React Native avec Expo.

## Caractéristiques

- ✅ **Gestion complète des thèmes** (clair/sombre)
- ✅ **Variantes multiples** (outlined, filled)
- ✅ **Tailles flexibles** (small, medium, large)
- ✅ **États visuels** (focus, error, disabled)
- ✅ **Icônes intégrées** (gauche/droite)
- ✅ **Toggle password** automatique
- ✅ **Support multiline**
- ✅ **Validation intégrée**
- ✅ **Accessibilité** complète
- ✅ **TypeScript** avec types complets

## Utilisation

### Import

```typescript
import Input from '../components/ui/Input';
// ou
import { Input } from '../components/ui';
```

### Exemples de base

#### Input simple
```tsx
<Input
  label="Email"
  placeholder="votre@email.com"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
/>
```

#### Input avec mot de passe
```tsx
<Input
  label="Mot de passe"
  placeholder="••••••••"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
  showPasswordToggle
  required
/>
```

#### Input avec icônes
```tsx
<Input
  label="Rechercher"
  placeholder="Tapez votre recherche..."
  value={search}
  onChangeText={setSearch}
  leftIcon="search"
  rightIcon="close-circle"
  onRightIconPress={() => setSearch('')}
/>
```

#### Input avec erreur
```tsx
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  error
  errorText="Format d'email invalide"
/>
```

## Props

### Props de base

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Label affiché au-dessus de l'input |
| `placeholder` | `string` | - | Texte de placeholder |
| `helperText` | `string` | - | Texte d'aide sous l'input |
| `errorText` | `string` | - | Message d'erreur (override helperText) |
| `required` | `boolean` | `false` | Affiche un astérisque rouge |

### Variantes et tailles

| Prop | Type | Default | Options |
|------|------|---------|---------|
| `variant` | `InputVariant` | `'outlined'` | `'default'`, `'filled'`, `'outlined'` |
| `size` | `InputSize` | `'medium'` | `'small'`, `'medium'`, `'large'` |

### États

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `error` | `boolean` | `false` | État d'erreur |
| `disabled` | `boolean` | `false` | Input désactivé |

### Icônes et actions

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `leftIcon` | `string` | - | Nom de l'icône Ionicons à gauche |
| `rightIcon` | `string` | - | Nom de l'icône Ionicons à droite |
| `onRightIconPress` | `() => void` | - | Callback pour l'icône droite |
| `showPasswordToggle` | `boolean` | `false` | Active le toggle password automatique |

### Styles personnalisés

| Prop | Type | Description |
|------|------|-------------|
| `containerStyle` | `ViewStyle` | Style du container principal |
| `inputStyle` | `TextStyle` | Style de l'input text |
| `labelStyle` | `TextStyle` | Style du label |

## Variantes

### Outlined (default)
```tsx
<Input variant="outlined" label="Outlined" />
```
- Bordure visible
- Fond transparent
- Style moderne

### Filled
```tsx
<Input variant="filled" label="Filled" />
```
- Pas de bordure
- Fond coloré
- Style Material Design

## Tailles

### Small
```tsx
<Input size="small" label="Small" />
```
- Hauteur: 40px
- Padding réduit
- Police plus petite

### Medium (default)
```tsx
<Input size="medium" label="Medium" />
```
- Hauteur: 48px
- Padding standard
- Police normale

### Large
```tsx
<Input size="large" label="Large" />
```
- Hauteur: 56px
- Padding étendu
- Police plus grande

## États visuels

Le composant gère automatiquement les états visuels :

- **Default** : État normal
- **Focused** : Bordure colorée en focus
- **Error** : Bordure rouge + message d'erreur
- **Disabled** : Opacité réduite + non-éditable

## Thèmes

Le composant s'adapte automatiquement aux thèmes :

### Mode clair
- Fond blanc
- Bordures grises
- Texte foncé

### Mode sombre
- Fond sombre
- Bordures claires
- Texte clair

## Exemples complets

### Formulaire d'inscription
```tsx
const [formData, setFormData] = useState({
  username: '',
  email: '',
  password: ''
});

return (
  <View>
    <Input
      label="Nom d'utilisateur"
      placeholder="johndoe123"
      value={formData.username}
      onChangeText={(value) => setFormData(prev => ({...prev, username: value}))}
      leftIcon="person"
      required
    />
    
    <Input
      label="Email"
      placeholder="votre@email.com"
      value={formData.email}
      onChangeText={(value) => setFormData(prev => ({...prev, email: value}))}
      leftIcon="mail"
      keyboardType="email-address"
      autoCapitalize="none"
      required
    />
    
    <Input
      label="Mot de passe"
      placeholder="••••••••"
      value={formData.password}
      onChangeText={(value) => setFormData(prev => ({...prev, password: value}))}
      leftIcon="lock-closed"
      secureTextEntry
      showPasswordToggle
      required
    />
  </View>
);
```

### Input de recherche
```tsx
const [search, setSearch] = useState('');

return (
  <Input
    placeholder="Rechercher des événements..."
    value={search}
    onChangeText={setSearch}
    leftIcon="search"
    rightIcon={search ? "close-circle" : undefined}
    onRightIconPress={() => setSearch('')}
    size="large"
  />
);
```

## Accessibilité

Le composant inclut :
- Labels automatiques pour les lecteurs d'écran
- Support des props d'accessibilité React Native
- Contraste approprié selon les thèmes
- Navigation clavier optimisée

## Migration depuis l'ancien Input

### Avant
```tsx
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  style={customStyle}
/>
```

### Après
```tsx
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  inputStyle={customStyle}
/>
```

### Changements principaux
- `style` → `inputStyle`
- Gestion automatique des thèmes
- Nouveaux props pour variantes et tailles
- Support des icônes intégré