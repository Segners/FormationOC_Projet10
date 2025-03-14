// cypress/e2e/product.cy.js

describe("Tests API avec authentification", () => {
  let authToken;
  beforeEach(() => {
    cy.request({
      method: "POST",
      url: `/login`,
      body: {
        username: "test2@test.fr",
        password: "testtest",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      authToken = response.body.token;
      Cypress.env("authToken", authToken);
    });
  });

  describe("Tests des produits", () => {
    let validProductId;
    const REQUIRED_FIELDS = [
      "id",
      "name",
      "availableStock",
      "skin",
      "aromas",
      "ingredients",
      "description",
      "price",
      "picture",
      "varieties",
    ];
    before(() => {
      cy.request(`/products`).then((response) => {
        validProductId = response.body[0]?.id;
      });
    });

    describe("GET /products", () => {
      it("Doit retourner la liste des produits", () => {
        cy.request(`/products`).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an("array").and.not.to.be.empty;

          // Vérification pour chaque produit
          response.body.forEach((product) => {
            expect(product).to.include.all.keys(REQUIRED_FIELDS);
            expect(product.id).to.be.a("number");
            expect(product.name).to.be.a("string");
            expect(product.availableStock).to.be.a("number");
            expect(product.price).to.be.a("number");
            expect(product.varieties).to.be.a("number");

            if (product.availableStock < 0) {
              cy.log(`Stock négatif détecté pour le produit ${product.id}`);
            }
          });
        });
      });
    });

    it("Doit retourner 3 produits valides", () => {
      cy.request({
        method: "GET",
        url: `/products/random`,
      }).then((response) => {
        // Vérification basique
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");
        expect(response.body).to.have.length(3);

        // Vérification détaillée pour chaque produit
        response.body.forEach((product) => {
          // Structure des données
          expect(product).to.include.all.keys(REQUIRED_FIELDS);
          // Types de données
          expect(product.id).to.be.a("number").and.to.be.greaterThan(0);
          expect(product.name).to.be.a("string").and.not.to.be.empty;
          expect(product.availableStock).to.be.a("number");
          expect(product.price).to.be.a("number").and.to.be.greaterThan(0);
          expect(product.varieties).to.be.a("number").and.to.be.greaterThan(0);
        });

        // Vérification d'unicité
        const ids = response.body.map((p) => p.id);
        const uniqueIds = [...new Set(ids)];
        expect(uniqueIds).to.have.length(3);
      });
    });

    describe("GET /products/{id}", () => {
      it("Doit retourner le détail complet", () => {
        // Récupération d'un ID valide
        cy.request(`/products`).then((response) => {
          const testProduct = response.body.find((p) => p.id === 3);

          cy.request(`/products/${testProduct.id}`).then((productResponse) => {
            expect(productResponse.status).to.eq(200);
            expect(productResponse.body).to.include.all.keys(REQUIRED_FIELDS);
            expect(productResponse.body.id).to.be.a("number");
            expect(productResponse.body.description).to.be.a("string");
            expect(productResponse.body.availableStock).to.be.a("number");
          });
        });
      });

      it("Doit retourner 404 pour un produit inexistant", () => {
        const invalidProductId = 9999;
        cy.request({
          method: "GET",
          url: `/products/${invalidProductId}`,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(404);
        });
      });
    });
  });
});
