import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import { dbConnext } from "./config/db.js";

// routes import
import routes from "./routes/index.js";
import User from "./models/User.js";

/* 配置 */
dotenv.config();
const app = express();
const swaggerDocument = YAML.load("./swagger.yaml");

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* 路由 */
// 配置Swagger UI路由
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", routes);

/* 数据库 */
const PORT = process.env.PORT || 3003;
dbConnext()
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
