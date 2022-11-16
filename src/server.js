import fileUpload from "express-fileupload";
import express from "express";
import dotenv from "dotenv";
import { routers } from "./router/router.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(fileUpload());
app.use(errorMiddleware);
app.use(routers);

app.all("/*", (req, res, next) => {
  res.status(500).json({
    message: req.url + " is not found",
  });
});

app.listen(1000, console.log(1000));
