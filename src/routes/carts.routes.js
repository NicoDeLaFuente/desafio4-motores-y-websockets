import {Router} from "express";
import {CartManager} from "../classes/cartManager.js"
import __dirname from "../utils.js";

const carts = new CartManager(`${__dirname}/carts.json`);

const router = Router();

router.post("/", async (req, res) => {
    await carts.addCart()
    res.json({status: "success", message: "carrito agregado"})
})

router.get("/", (req, res) => {
    const cartsStored = carts.getCarts()

    res.json({message: "success", carts: cartsStored})
})

router.get("/:cid", async (req, res) => {
    const cid = parseInt(req.params.cid)

    const cart = carts.getCartById(cid);

    if (!cart) {
        res.status(400).send(`El carrito con el ID ${cid}, no se encuentra.`)
    } else {
        res.json({message: "success", cart: cart})
    }
})

router.post("/:cid/product/:pid", (req, res) => {
    const cid = parseInt(req.params.cid)
    const pid = parseInt(req.params.pid)

    const cartUpdated = carts.addProductToCart(cid, pid);
    res.json({message: "Producto del carrito actualizado", cart: cartUpdated})
})



export default router;