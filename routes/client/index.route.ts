import { Express } from "express";
import { taskRoute } from "./task.route";
import { userRoute } from "./user.route";

// const authenMiddleware = require("../../middlewares/client/authen.middleware.js");

export const routeClient = (app: Express) =>
{
   app.use(
      "/tasks",
      // authenMiddleware.checkAuthen,
      taskRoute
   );

   app.use("/user", userRoute);
}