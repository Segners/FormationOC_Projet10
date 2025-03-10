import { defineConfig } from "cypress";

export default defineConfig({
  reporter: 'mochawesome',
  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
    },
    specPattern: "**/*.cy.ts",
  },

  e2e: {
    baseUrl: "http://localhost:8081",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
