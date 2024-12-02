import { Express } from "express";
import { taskRoute } from "./task.route";
import { userRoute } from "./user.route";

import * as authenMiddleware from "../../middlewares/client/authen.middleware";

export const routeClient = (app: Express) =>
{
   app.use(
      "/tasks",
      authenMiddleware.checkAuthen,
      taskRoute
   );

   app.use("/user", userRoute);
}