// cypress/e2e/orders.cy.js
import { faker } from '@faker-js/faker'

describe("API Orders Test", () => {
  let authToken;
  let cartId;
  const apiUrl = "/orders";
  beforeEach(() => {
    cy.request({
      method: "POST",
      url: "/login",
      body: {
        username: "test2@test.fr",
        password: "testtest",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      authToken = response.body.token;
    });
  });

  it("Retourne 401 si l'utilisateur est pas autorisé", () => {
    cy.request({
      method: "GET",
      url: apiUrl,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401); // doit retourner 403 donc Anomalie
    });
  });

  it("Doit récuperer le panier", () => {
    cy.request({
      method: "GET",
      url: "/orders",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).exist

    });
  });

  it('Rajoute un objet indisponible dans le panier', () => {
    cy.request({
      method: "PUT", //anomalie
      url:"/orders/add",
      headers: {
        Authorization:`Bearer ${authToken}`,
      },
      body: {
        "quantity": 1,
        "product": 4
      }
    }).then((response) => {
      expect(response.status).to.eq(200);//Ne doit pas etre possible donc Anomalie
      const expectedProduct = {
        "name": "Chuchotements d'été",
        "description": "Savon surgras à l'huile d'olive, particulièrement utile contre la peau sèche.",
        "price": 37,
        "picture": "https://cdn.pixabay.com/photo/2017/09/07/19/43/soap-2726387_960_720.jpg"
      };
      expect(response.body.orderLines[0].product).to.include(expectedProduct);
      cartId = response.body.orderLines[0].id;


    });
  });



 context(
    "Ajoute un produit, change la quantité dans le panier et vide le panier",
    () => {
      const randomQuantity = faker.number.int({ min: 1, max: 10 });
      let productId;
      let cartId;

      it("Renvoie un produit aleatoire", () => {
        cy.request({
          method: "GET",
          url: "/products/",
          headers: {
            Authorization:`Bearer ${authToken}`,
          },
        }).then((response) => {
          productId =
            response.body[Math.floor(Math.random() * response.body.length)].id;
            cy.log(productId)
        });
      });

      it("Rajoute le produit au paniert", () => {
        cy.request({
          method: "PUT", // devrait etre POST, anomalie
          url: "/orders/add",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: {
            product: productId,
            quantity: randomQuantity,
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
          cartId = response.body.orderLines[0].id;
          cy.log(cartId)
        });
      });

      it("Change la quantité du produit dans le panier", () => {
        cy.request({
          method: "PUT",
          url: `/orders/${cartId}/change-quantity`,
          headers: {
            Authorization:`Bearer ${authToken}`,
          },
          body: {
            quantity: 2,
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
        });
      });

      it("Vide le panier", () => {
        cy.request({
          method: "DELETE",
          url: `/orders/${cartId}/delete`,
          headers: {
            Authorization:`Bearer ${authToken}`,
          },
        }).then((response) => {
          expect(response.status).to.be.eq(200);
        });
      });
    }
  );
});