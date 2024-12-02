import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import cors from "cors";

import { connectDatabase } from "./config/database";
connectDatabase();

import { routeClient } from "./routes/client/index.route";

const app: Express = express();
const port: number | string = process.env.PORT || 3000;


// ---- CORS
// ++ Cach 1 : tat ca cac ten mien khac duoc phep truy cap vao tat ca API cua minh
app.use(cors());
// ++ End cach 1

// ++ Cach 2 : chi co dung ten mien moi duoc phep truy cap vao tat ca API cua minh
// var corsOptions = {
//    origin: 'http://abc.com',
//    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

// app.use(cors(corsOptions));
// ++ End cach 2
// ---- End CORS


// bodyParser
// app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json, cai nay la FE gui data len thong qua chuoi JSON
// End bodyParser


routeClient(app); // goi den ham index cua file index.route.js


app.listen(port, () => {
   console.log(`App listening on port ${port}`);
});