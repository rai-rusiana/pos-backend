import express from "express";
import userRouter from "./src/routes/user.routes.js";
import branchRouter from "./src/routes/branch.routes.js";
import storeRouter from "./src/routes/store.routes.js";
import inventoryRouter from "./src/routes/inventory.routes.js";
import itemRouter from "./src/routes/item.routes.js";
import transactionRouter from "./src/routes/transaction.routes.js";
import categoryRouter from "./src/routes/category.routes.js";
import cors from 'cors'

const app = express();

const PORT = process.env.PORT || 3000;

// --- Routes ---
app.use(cors()); // Use the cors middleware here
app.use(express.json());
app.use("/api/users/", userRouter);
app.use("/api/branches/", branchRouter);
app.use("/api/stores/", storeRouter);
app.use("/api/inventories/", inventoryRouter);
app.use("/api/item/", itemRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/categories", categoryRouter);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("Endpoints:");

  // Dynamically log all the routes from the userRouter
  const basePath = "/api/";
  console.log("<<=========== User Router =========>>");
  userRouter.stack.forEach((layer) => {
    // Check if the layer is a router and has a route
    if (layer.route) {
      const route = layer.route;
      const methods = Object.keys(route.methods).join(", ").toUpperCase();
      console.log(
        `- ${methods} http://localhost:${PORT}${basePath}users${route.path}`
      );
    }
  });
  console.log("<<=========== Branch Router =========>>");
  branchRouter.stack.forEach((layer) => {
    // Check if the layer is a router and has a route
    if (layer.route) {
      const route = layer.route;
      const methods = Object.keys(route.methods).join(", ").toUpperCase();
      console.log(
        `- ${methods} http://localhost:${PORT}${basePath}branches${route.path}`
      );
    }
  });
  console.log("<<=========== Store Router =========>>");
  storeRouter.stack.forEach((layer) => {
    // Check if the layer is a router and has a route
    if (layer.route) {
      const route = layer.route;
      const methods = Object.keys(route.methods).join(", ").toUpperCase();
      console.log(
        `- ${methods} http://localhost:${PORT}${basePath}stores${route.path}`
      );
    }
  });
  console.log("<<=========== Inventory Router =========>>");
  inventoryRouter.stack.forEach((layer) => {
    // Check if the layer is a router and has a route
    if (layer.route) {
      const route = layer.route;
      const methods = Object.keys(route.methods).join(", ").toUpperCase();
      console.log(
        `- ${methods} http://localhost:${PORT}${basePath}inventories${route.path}`
      );
    }
  });
  console.log("<<=========== Item Router =========>>");
  itemRouter.stack.forEach((layer) => {
    // Check if the layer is a router and has a route
    if (layer.route) {
      const route = layer.route;
      const methods = Object.keys(route.methods).join(", ").toUpperCase();
      console.log(
        `- ${methods} http://localhost:${PORT}${basePath}item${route.path}`
      );
    }
  });

  console.log("<<=========== Category Router =========>>");
  categoryRouter.stack.forEach((layer) => {
    // Check if the layer is a router and has a route
    if (layer.route) {
      const route = layer.route;
      const methods = Object.keys(route.methods).join(", ").toUpperCase();
      console.log(
        `- ${methods} http://localhost:${PORT}${basePath}categories${route.path}`
      );
    }
  });
  console.log("<<=========== Transaction Router =========>>");
  transactionRouter.stack.forEach((layer) => {
    // Check if the layer is a router and has a route
    if (layer.route) {
      const route = layer.route;
      const methods = Object.keys(route.methods).join(", ").toUpperCase();
      console.log(
        `- ${methods} http://localhost:${PORT}${basePath}transaction${route.path}`
      );
    }
  });
});

export default app;
