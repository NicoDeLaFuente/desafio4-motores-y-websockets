import { Router } from "express";
import { getProductsList } from "../services/productUtils.js";

const viewsRouter = Router();

viewsRouter.get("/", (req, res) => {
    const products = getProductsList();
    res.render("home", {products})
})

export default viewsRouter;