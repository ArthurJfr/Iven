# 💸 Crypto Wallet UI - Expo React Native

Ce projet est une application mobile réalisée avec **React Native** (Expo) et **TypeScript**.  
Elle reproduit l’interface d’un portefeuille crypto inspirée de Coinbase, avec :

- Affichage du solde
- Boutons d’actions (Buy, Sell, Send, Receive, More)
- Liste de cryptomonnaies avec icônes, prix, et mini-graph
- TopBar avec menu burger, bouton « Get $10 » et cloche de notification

## 👀 Aperçu

Voici un aperçu de l’interface de l’application :

<div align="center">
  <img src="./assets/preview.png" alt="Aperçu de l’application" width="300" />
</div>

<!--
Remplace `preview.png` par le nom de ton image d’aperçu si besoin.
Tu peux aussi mettre une capture d’écran du simulateur ou de ton téléphone.
-->

## 📋 Fonctionnalités principales

- **UI moderne** et responsive
- **Affichage dynamique** de la liste des cryptos (mock ou API CoinGecko)
- **Gestion du SafeArea** pour iOS/Android
- **Composants réutilisables** (`TopBar`, `Balance`, `BalanceButtons`, `CryptoItem`)
- **Icônes** via [Expo Vector Icons](https://docs.expo.dev/guides/icons/)
- **Assets** personnalisés (icônes crypto, graphes, etc.)

## 🚀 Lancer le projet

1. **Installer les dépendances**
   ```sh
   npm install
   # ou
   yarn
   ```

2. **Démarrer Expo**
   ```sh
   npx expo start
   ```

3. Scanner le QR code avec l’application **Expo Go** ou lancer sur un simulateur.

## 📦 Structure du projet

```
.
├── App.tsx
├── components/
│   ├── TopBar.tsx
│   ├── Balance.tsx
│   ├── BalanceButtons.tsx
│   └── CryptoItem.tsx
├── assets/
│   ├── crypto/         # Icônes des cryptos
│   └── graph/          # Images des mini-graphes
├── hooks/
├── package.json
└── ...
```

## ✨ Bonus possibles

- Récupérer la liste des cryptos en temps réel via l’API [CoinGecko](https://www.coingecko.com/en/api)
- Ajout d’un **mode sombre** (toggle)
- Navigation multi-écrans

## 📚 Ressources

- [Expo Vector Icons](https://docs.expo.dev/guides/icons/)
- [CoinGecko API](https://www.coingecko.com/en/api)
- [Expo Documentation](https://docs.expo.dev/)

---

**Auteur :** Arthur JAFFRO  
Exercice réalisé dans le cadre d’un apprentissage React Native / UI mobile
