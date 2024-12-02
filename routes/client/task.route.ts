import express from "express";
const router = express.Router(); // ham Router() de dinh nghia ra cac route con

import * as controller from "../../controllers/client/task.controller";

router.get("/", controller.index);
router.get("/detail/:id", controller.getDetailTask);

router.patch("/change-status/:id", controller.changeStatus_Cach1);
router.patch("/change-status", controller.changeStatus);

router.post("/create", controller.createTask);
router.patch("/edit/:id", controller.editTask);

router.patch("/delete", controller.deleteSoftTasks);
router.delete("/delete-permanent", controller.deletePermanentTasks);

export const taskRoute = router;