# RWAYEH — Boutique de parfums au Maroc

Projet React + TypeScript + Vite + Tailwind CSS.

## Démarrage sur Windows

1. Installer Node.js LTS si ce n'est pas déjà fait.
2. Ouvrir ce dossier dans Cursor ou VS Code.
3. Ouvrir le terminal dans ce dossier.
4. Exécuter :

```bash
npm install
npm run dev
```

5. Ouvrir l'adresse affichée par Vite, généralement `http://localhost:5173`.

## Ce qui est inclus

- Boutique responsive mobile / tablette / PC
- Recherche par parfum, marque et famille olfactive
- Filtres Homme, Femme, Unisex, nouveautés et promotions
- Fiches produits avec notes, formats et recommandations
- Favoris et panier sauvegardés dans localStorage
- Gestion des quantités et respect du stock disponible
- Livraison gratuite dès 500 DH
- Checkout marocain avec villes et paiement à la livraison
- Confirmation de commande avec numéro de commande
- Dashboard admin local de démonstration
- Animations avec Motion et icônes Lucide React
- Photos produits locales dans `public/products`
- Tout le code React principal est regroupé dans `src/App.tsx`

## Important

Le checkout est actuellement front-end : les commandes ne sont pas encore envoyées vers une base de données ou un service de livraison. Le bouton WhatsApp est configuré sur le numéro de la boutique dans `src/App.tsx`.
