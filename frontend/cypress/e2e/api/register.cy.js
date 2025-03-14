import { faker } from "@faker-js/faker";

describe("Tests inscription", () => {
  it("Inscription réussie avec données aléatoires", () => {
    const userData = {
      email: faker.internet.email().toLowerCase(),
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      plainPassword: {
        first: "Azerty123!",
        second: "Azerty123!",
      },
    };

    cy.request({
      method: "POST",
      url: `/register`,
      body: userData,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.email).to.eq(userData.email);
    });
  });
  
  // Test d'erreurs de validation
  describe("Cas d'erreur d'inscription", () => {
    const testCases = [
      {
        name: "Email invalide",
        data: {
          email: "pasunemail",
          firstname: "Jean",
          lastname: "Dupont",
          plainPassword: { first: "pass", second: "pass" },
        },
        expectedError: "email",
      },
      {
        name: "Mot de passe trop court",
        data: {
          email: "test@example.com",
          firstname: "Jean",
          lastname: "Dupont",
          plainPassword: { first: "pass", second: "pass" },
        },
        expectedError: "plainPassword",
      },
      {
        name: "Mots de passe différents",
        data: {
          email: "test@example.com",
          firstname: "Jean",
          lastname: "Dupont",
          plainPassword: { first: "password123", second: "different" },
        },
        expectedError: "plainPassword",
      },
    ];

    testCases.forEach(({ name, data, expectedError }) => {
      it(name, () => {
        cy.request({
          method: "POST",
          url: `/register`,
          body: data,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(400);
          expect(response.body).to.have.property(expectedError);
        });
      });
    });
  });

  // Test de récupération du profil
  describe("GET /me", () => {
    let authToken;

    before(() => {
      cy.request({
          method: "POST",
          url: `/login`,
          body: {
            username: "test2@test.fr",
            password: "testtest",
          },
        })
        .then((response) => {
          expect(response.status).to.eq(200);
          authToken = response.body.token;
          Cypress.env("authToken", authToken);
        });
    });

    it("Récupération du profil", () => {
      cy.request({
        method: "GET",
        url: `/me`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.include.keys("email", "firstname", "lastname");
      });
    });
  });
});
