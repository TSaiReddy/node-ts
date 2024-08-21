// Packages
import dotenv from "dotenv";
import express, { Application } from "express";

import { apiRoutes } from "./api/api";

const app: Application = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

apiRoutes(app);

app.listen(process.env.port, () => console.log("App listening on port 3000"));
