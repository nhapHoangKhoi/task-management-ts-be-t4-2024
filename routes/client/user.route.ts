import express from "express";
const router = express.Router(); // ham Router() de dinh nghia ra cac route con

import * as controller from "../../controllers/client/user.controller";
import * as authenMiddleware from "../../middlewares/client/authen.middleware";

router.post("/register", controller.registerAccount);
router.post("/login", controller.loginAccount);

router.post("/password/forgot", controller.forgotPassword);
router.post("/password/otp", controller.otpPassword);
router.patch("/password/reset", controller.resetPassword);

router.get(
   "/profile",
   authenMiddleware.checkAuthen, 
   controller.getProfile
);


export const userRoute = router;