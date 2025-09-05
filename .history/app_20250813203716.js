import express from "express";
import { PrismaClient } from "./generated/prisma/index.js";
import userRouter from "./src/routes/user.routes.js";
import branchRouter from "./src/routes/branch.routes.js";
import storeRouter from './src/routes/store.routes.js'
import inventoryRouter from './src/routes/inventory.routes.js'
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use("/api/users/", userRouter);
app.use("/api/branches/", branchRouter);
app.use("/api/stores/", storeRouter);
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
});

export default app;
