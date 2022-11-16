import { Router } from "express";
import { LOGIN } from "../controllers/login.controller.js";
import accessToken from "../middleware/accessToken.js";
import { CATDELETE, CATEGORIEGET, CATGET, CATPOST, CATPUT } from "../controllers/cat.controller.js";
import { PRODELETE, PRODUCTSGET, PROGET, PROPOST, PROPUT } from "../controllers/products.controller.js";
import { SUBCATEGORYSGET, SUBDELETE, SUBGET, SUBPOST, SUBPUT } from "../controllers/sub.controller.js";

export const routers = Router();

routers.post("/login", LOGIN);
routers.get("/categories/:id", CATEGORIEGET);
routers.get("/categories", CATGET);
routers.post("/categories/post",accessToken, CATPOST);
routers.put("/categories/put/:id",accessToken, CATPUT);
routers.delete("/categories/delete/:id",accessToken, CATDELETE);
routers.get("/subCategories", SUBCATEGORYSGET)
routers.get("/subCategories/:id", SUBGET)
routers.post("/subCategories/post",accessToken, SUBPOST)
routers.put("/subCategories/put/:id",accessToken, SUBPUT)
routers.delete("/subCategories/delete/:id",accessToken, SUBDELETE)
routers.get("/products", PRODUCTSGET)
routers.get("/products/:id", PROGET)
routers.post("/product/post",accessToken, PROPOST)
routers.put("/product/put/:id",accessToken, PROPUT)
routers.delete("/product/delete/:id",accessToken, PRODELETE)