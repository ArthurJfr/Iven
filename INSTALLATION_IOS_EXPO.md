# 📱 Installation & Build Expo React Native – iOS

## 1. Installer Expo CLI (globalement)
```sh
npm install -g expo-cli
```
> **Évite `sudo`** pour npm global si possible (privilégie un Node installé via Homebrew ou nvm).

---

## 2. (Optionnel) Ajouter Node au PATH (si besoin)
```sh
export PATH="$PATH:/opt/homebrew/opt/node@20/bin"
```
> Adapte le chemin à ta version de Node/Homebrew.

---

## 3. Vérifier la version d’Expo CLI
```sh
expo --version
```

---

## 4. Créer un projet Expo
```sh
npx create-expo-app mon-app
cd mon-app
```
> **Évite `sudo expo init`** (jamais de sudo pour créer un projet JS).

---

## 5. Installer les dépendances natives nécessaires
```sh
npx expo install expo-camera expo-media-library expo-router
```

---

## 6. Démarrer le projet (Expo Go)
```sh
npx expo start
```
- Pour démarrer avec le cache vidé :
  ```sh
npx expo start --clear
  ```

---

## 7. Générer le dossier iOS natif (pour Xcode)
```sh
npx expo prebuild
```
> **Évite `sudo`** ici aussi.

---

## 8. Installer CocoaPods (si pas déjà fait)
```sh
brew install cocoapods
```
ou
```sh
sudo gem install cocoapods
```

---

## 9. Installer les pods iOS
```sh
cd ios
pod install --repo-update
cd ..
```

---

## 10. Nettoyer le cache Xcode (si build échoue)
```sh
rm -rf ~/Library/Developer/Xcode/DerivedData
```

---

## 11. Ouvrir le projet dans Xcode
```sh
open ios/*.xcworkspace
```

---

## 12. (Xcode) Sélectionner la team, corriger le bundle ID, build sur simulateur ou iPhone
- Onglet **Signing & Capabilities**
- Sélectionne ton compte Apple (gratuit possible)
- Modifie le bundle identifier si besoin (ex : `com.prenom.nom.monapp`)
- Clique sur « Run »

---

## Conseils
- **Évite d’utiliser `sudo`** avec npm, expo, ou yarn (sauf pour installer des outils système comme CocoaPods).
- Utilise toujours le fichier `.xcworkspace` pour ouvrir dans Xcode, jamais `.xcodeproj`.
- Si tu as des erreurs de permissions, corrige-les avec :
  ```sh
  sudo chown -R $(whoami) .
  chmod -R u+rw .
  ```

---

**Garde ce fichier comme référence pour tous tes projets Expo natifs iOS !** 