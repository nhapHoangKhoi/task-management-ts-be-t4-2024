import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

import { connectDatabase } from "./config/database";
import TaskModel from "./models/task.model";
connectDatabase();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.get("/tasks", async (request: Request, response: Response) => {
   const tasks = await TaskModel.find({});

   response.json(tasks);
});

app.listen(port, () => {
   console.log(`App listening on port ${port}`);
});