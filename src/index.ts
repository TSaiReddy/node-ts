// Packages
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import express, { Application } from "express";

import { apiRoutes } from "./api/api";
import { databaseConnection } from "./lib/database";
import { errorHandler } from "./middleware/errorMiddleware";

const app: Application = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Adds Security Headers
app.use(helmet());
app.use(helmet.permittedCrossDomainPolicies({ permittedPolicies: "none" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  message: "Too many requests, please try again later.",
});

app.use(limiter);

(async function () {
  try {
    const port = process.env.PORT;
    await databaseConnection();
    app.listen(port, () => console.log(`Running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
})();

apiRoutes(app);

app.use(errorHandler);
