import express, { Express, Request, Response } from "express";

const app: Express = express();
const port: number = 3000;

app.get("/tasks", (request: Request, response: Response) => {
   response.send("Danh sách công việc");
});

app.listen(port, () => {
   console.log(`App listening on port ${port}`);
});