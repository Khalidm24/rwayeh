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

## Base de données et Vercel

Le projet utilise Neon Postgres via des fonctions serverless Vercel. Les produits sont chargés par
`/api/products` et le checkout crée une commande réelle via `/api/orders`.

1. Créer une base Neon depuis le Marketplace Vercel et copier `DATABASE_URL` dans les variables d’environnement du projet.
2. Exécuter `migrations/001_initial.sql` dans l’éditeur SQL Neon.
3. Définir `ADMIN_TOKEN` avec une valeur aléatoire longue dans Vercel.
4. Redéployer. Les routes d’administration (`/api/admin/*`) exigent `Authorization: Bearer $ADMIN_TOKEN`.

Variables requises : `DATABASE_URL`, `ADMIN_TOKEN`. Ne jamais les mettre dans le code client.
