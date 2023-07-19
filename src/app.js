import express from 'express';
import {engine} from 'express-handlebars'
import __dirname from './utils.js';
import viewsRouter from './routes/views.routes.js';
import productRouter from "./routes/products.routes.js"
import cartRoutes from "./routes/carts.routes.js"
import realTimeProducts from "./routes/realTimeProducts.routes.js"
import {Server} from 'socket.io' //importo socket server
import { saveProduct } from './services/productUtils.js';
import { deleteProduct } from './services/productUtils.js';

const app = express();
const PORT = 8080;

//middelwares para leer json y lenguaje. 
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//middleware para leer la carpeta publica
app.use(express.static("public"))

//config para usar handlebars
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", `${__dirname}/views`)

//routes
app.use("/", viewsRouter)
app.use("/api/products", productRouter)
app.use("/api/carts", cartRoutes)
app.use("/realtimeproducts", realTimeProducts)

//comenzamos a trabajar con sockets.
const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando al puerto ${PORT}`)
})

const socketServer = new Server(httpServer);

socketServer.on('connection', socket => {
    console.log("Nuevo cliente se ha conectado");
    
    //socket on escucha
   socket.on('message', (data) => {
        console.log(data)
    })

    //socket emit envia
    socket.emit('render', "Me estoy comunicando desde el servidor")

    socket.on("addProduct", product => {
        saveProduct(product) //fn que guarda el producto en BBDD
        socket.emit("show-new-products", product)
    })

    socket.on("delete-product", productId => {
        const {id} = productId
        deleteProduct(id) // fn que borra productos en services
        socket.emit('delete-product', id)
    })
    
})

