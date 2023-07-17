import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";

import swaggerConfig from "./config/swagger.js";
import { dbConnext } from "./config/db.js";

// routes import
import routes from "./routes/index.js";

/* 配置 */
dotenv.config();
const app = express();
// const swaggerDocument = YAML.load("./swagger.yaml");

// 将 public 目录设置为静态资源目录
app.use(express.static("public"));
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(swaggerConfig)

/* 路由 */
app.use("/", routes);

/* 数据库 */
const PORT = process.env.PORT || 3003;
dbConnext()
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
