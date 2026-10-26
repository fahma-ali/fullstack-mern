import express from 'express';
import path, { join } from 'path'
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'
import mongoose from 'mongoose';

//API security
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";


import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from './utils/swagger.js';


import { errprHandler } from "./middleware/globalError.js";

import taskRoute from './route/task.js'
import authRoute from "./route/auth.js";
import adminRoute from "./route/authorize.js";
import { limiter } from './middleware/rateLimiter.js';


const app = express();
dotenv.config()
const port=process.env.PORT 

mongoose
  .connect(
    process.env.NODE_ENV == "development"
      ? process.env.MONGO_URI_DEV
      : process.env.MONGO_URI_PRO,
  )
  .then(() => console.log("CONNECTED MONGODB"))
  .catch(() => console.log("NOT CONNECTED MONGODB"));

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(cors());
app.use("/api", limiter);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/task", taskRoute);
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);

if (process.env.NODE_ENV === "production") {
  const _dirname = path.dirname(fileURLToPath(import.meta.url));
  const distPath = path.join(_dirname, "../frontend/dist");

  app.use(express.static(distPath));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}


app.use(errprHandler);


app.listen(port, () => {
    console.log(`✅ Server is listening on port ${port}`);
})