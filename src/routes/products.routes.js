import { Router } from "express";
import { ProductManager } from "../classes/productManager.js";
import __dirname from "../utils.js";

const products = new ProductManager(`${__dirname}/products.json`);

const router = Router();

router.get("/", async (req, res) => {
  const { limit } = req.query;

  try {
    const response = await products.getProducts();

    if (limit && response.length > limit) {
      let newResponse = response.splice(0, limit);
      res.json({ response: newResponse, cantidad: newResponse.length });
    } else {
      res.json({
        message: "success",
        response: response,
        quantity: response.length,
      });
    }
  } catch {
    res.status(500).send("No se pudieron recuperar los datos pedidos.");
  }
});

router.get("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);

  try {
    const response = await products.getProducts();

    const productById = response.findIndex((product) => product.id === pid);

    if (productById !== -1) {
      res.json({ status: "success", product: response[productById] });
    } else {
      res
        .status(404)
        .send("Por favor verifica el ID enviado ya que no existe.");
    }
  } catch {
    res.status(500).send("No se pudieron recuperar los datos pedidos.");
  }
});

router.post("/", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;

  const newProduct = {};

  //traigo los productos, para ver el ID del ultimo producto y agregarle uno.
  const productsStored = await products.getProducts();
  const lastIndex = productsStored.reduce((acc, currentValue) => {
    if (acc > currentValue) {
      return acc;
    }
    return currentValue;
  });
  const id = lastIndex.id + 1;

  if ((!title, !description, !code, !price, !stock, !category)) {
    res.status(400).send("Faltan datos para poder postear el producto");
  } else {
    (newProduct.title = title),
      (newProduct.description = description),
      (newProduct.code = code),
      (newProduct.price = price),
      (newProduct.status =
        !status || typeof status !== "boolean" ? true : status),
      (newProduct.stock = stock),
      (newProduct.category = category),
      (newProduct.thumbnails = !thumbnails ? [] : thumbnails),
      (newProduct.id = id);
  }

  try {
    const response = products.addProduct(newProduct);
    res.json({ message: "producto agregado", product: response });
  } catch (err) {
    console.log(err);
    res.status(500).send("problemas con el servidor.");
  }
});

router.put("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);
  const productToUpdate = req.body;

  if (productToUpdate.id) {
    res.status(400).send("No se puede actualizar el ID de un producto");
  }

  try {
    products.updateProduct(pid, productToUpdate);
    res.json({
      message: `El producto con el ID ${pid} se ha actualizado correctamente`,
      product: productToUpdate,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error del servidor");
  }
});

router.delete("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);

  console.log(pid);

  const product = await products.getProductById(pid);

  if (!product) {
    res.send(`el producto con el ID ${pid} no existe`);
  } else {
    const response = await products.deleteProduct(pid);
    res.json({
      message: `el producto con el id ${pid} se ha eliminado correctamente`,
      product: product,
    });
  }
});

export default router;
