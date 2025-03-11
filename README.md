# Automatisez des tests pour une boutique en ligne

Projet 10 de la formation de Testeur de logiciel. 

Mise en place de tests automatiques avec Cypress.

Dans ce projet, ma mission est d'automatiser les tests fonctionnels pour le site web de l'entreprise Eco Bliss Bath, une start-up, spécialisée dans la vente de produits de beauté écoresponsables dont le produit principal est un savon solide. 

# Table des matières 
||
|-------|
|📦 [Installation](#installation)|
|🚀 [Utilisation](#utilisation)|
|📄 ️[Génération des rapports](#rapports)|
||
## Installation

### **Prérequis**

- [NodeJS](https://nodejs.org/en/learn)
- [npm](https://docs.npmjs.com/about-npm)
- [Cypress](https://www.cypress.io/)
- [Docker](https://www.docker.com/)
- [mochawesome](https://www.npmjs.com/package/mochawesome)


### **Installation**
- Installer **NodejS**

- Depuis un terminal ouvert dans le dossier du projet, lancer la commande (utiliser sudo si sous linux) :

```bash 
docker-compose up --build
 ```
- Installer et ouvrir **Cypress**

```bash 
npm install cypress --save-dev
npx cypress open 
```
- Choisir **E2E** testing, suivre la configuration et choisir le navigateur désiré
    
- Installer **mochawesome** :
```bash 
npm install mochawesome --save-dev
```
Dans **cypress.config.js** (ou ts) rajouter la ligne 
```javascript
module.exports = defineConfig({
  reporter: 'mochawesome',
  // ...rest of the config
});
```
## Exécution des tests

### 🧪 Tests E2E avec Cypress

### Stratégie de Test
Les tests automatisés couvrent les fonctionnalités critiques de l'application :
- **Authentification** : Connexion/Déconnexion, Gestion des accès
- **Catalogue Produits** : Affichage, Détails
- **Panier** : Ajout/Retrait de produits, Modification des quantités
- **API** : Validation des endpoints et des réponses, tests d’erreurs
- **Fonctionnalités** : 
    - Vérifier la navigation des différentes pages du site. Page d’accueil, page de connexion, page produit et page panier.
    - Tests de l’ajout de produits au panier, modification des quantités et suppression des articles du panier.
 - **Smoketests** : 
    - vérifiez la présence des champs et boutons de connexion
    - vérifiez la présence des boutons d’ajout au panier quand vous êtes connecté
    - vérifiez la présence du champ de disponibilité du produit 

### Utilisation
1. Ouvrir **Cypress** puis **E2E**.

2. **Cypress** s'ouvre sur le navigateur choisi.

3. Choisir specs.

4. Exécuter les tests.

#### Dans E2E il y 4 dossiers pour les différents tests :
#### 📂 Structure du projet
```bash 
📁 cypress
└── 📁 e2e
    ├── 📁 api # Tests d'API
    │ ├── 📄 login.cy.js
    │ ├── 📄 orders.cy.js
    │ ├── 📄 product.cy.js
    │ ├── 📄 register.cy.js
    │ └── 📄 review.cy.js
    │
    └── 📁 login # authentification
    │   ├── 📄 login.cy.js
    │   └── 📄 register.cy.js
    │
    └── 📁 cart # Tests du panier
    ├── 📄 cart.cy.js
    │
    └── 📁 smoke_test # Smoke tests
      └── 📄 smoke_test.cy.js
 ```
Cliquez sur un des tests pour l'exécuter :
![alt text](images/image-1.png)
 ## Rapports :
 ```bash 
npx cypress run --reporter mochawesome
 ```
 ### Explications complémentaires :
Les rapports de test permettent de :

- Visualiser les résultats des tests (succès/échecs)

- Analyser le temps d'exécution

- Débuguer les erreurs via les captures d'écran

- Générer des statistiques de couverture

**Exemple :**
![alt text](/images/image.png)
![alt text](<images/Tests du panier.png>)