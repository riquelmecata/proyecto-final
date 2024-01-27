import { Router } from 'express';
import { dbM as dbInstance } from '../controller/product.controller.js';
import { dbM as dbCart } from '../controller/cart.controller.js';
import { isAdmin, isLogged, isPremium } from "../middlewares/auth.middleware.js"
import { nanoid } from 'nanoid';
import { faker } from '@faker-js/faker';
import viewsController from '../controller/views.controller.js';
import { postTicket } from '../controller/ticket.controller.js';
import SessionDTO from '../dto/UsersDTO/session.dto.js';

// Importar todos los routers;
export const router = Router();

router.get("/products",   async (req, res) => {
    if(!req?.user?.email) return res.redirect("/login")
    try {
        const { limit, page, sort } = req.query
        let on = await dbInstance.getProducts(limit, page, sort)
        let productos = JSON.parse(JSON.stringify(on))
        res.render("products", {
            hasNextPage: productos.hasNextPage,
            hasPrevPage: productos.hasPrevPage,
            nextLink: productos.nextLink ? `http://localhost:8080/products?page=${productos.page + 1}&limit=${limit?limit:10}` : null,
            prevLink: productos.prevLink ? `http://localhost:8080/products?page=${productos.page - 1}&limit=${limit?limit:10}` : null,
            productos: productos.payload,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            role: req.user.role,
            age: req.user.age
            
        })
    } catch (e) {
        res.send(500).json({ error: e })
    }
})

router.get("/products/:pid", isLogged, async (req, res) => {
    try {
        const { pid } = req.params
        let on = await dbInstance.getProductById(pid)
        let productos = JSON.parse(JSON.stringify(on))
        console.log(productos)
        res.render("detail", {
            producto: productos
        })
    } catch (e) {
        res.send(500).json({ error: e })
    }
})

router.get("/newProduct", isPremium, async (req, res) => { 

    res.render("createProduct", {
        title: "Crear producto",
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        role: req.user.role,
        age: req.user.age

    });
})

router.get("/carts/:cid", isLogged, async (req, res) => {
    try {
        const { cid } = req.params
        let on = await dbCart.getCartById(cid)
        let productos = JSON.parse(JSON.stringify(on))
        console.log(productos.products)
        res.render("carts", {
            productos: productos.products
        })
    } catch (e) {
        res.send(500).json({ error: e })
    }
})

router.get("/login", async (req, res) => {
    try {

        res.render("login")
    } catch (e) {
        res.send(500).json({ error: e })
    }
})

router.get("/register", async (req, res) => {
 
    try {

        res.render("register")
    } catch (e) {
        res.send(500).json({ error: e })
    }
})


/** esto funciona */
router.get("/profile", isLogged, async (req, res) => { 
    res.render("profile", {
        title: "Vista Profile",
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        role: req.user.role,
        age: req.user.age

    });
})

router.get('/purchaseEnded/:ticketId', async (req, res) => { 

    res.render('purchaseEnded', {
        title: "Compra realizada"

    });
})

router.get("/chat", async (req, res) => {

    try {

        res.render("chat")
    } catch (e) {
        res.send(500).json({ error: e.message })
    }
})

//-----------------------------------Mocking--------------------------------//

router.get("/mockingproducts", async(req,res)=>{

    const products = [];

    for (let i = 0; i < 100; i++) {
        const product = {
            id: nanoid(),
            title: faker.commerce.productName(),
            description: `Product ${i + 1}`,
            price: faker.commerce.price(),
            thumbnail: [faker.image.url()],
            code: faker.string.uuid(),
            stock: faker.number.int({ min: 0, max: 100 }),
            status: faker.datatype.boolean(),
            category: faker.commerce.department(),
            availability: faker.helpers.arrayElement(['in_stock', 'out_of_stock']) 
        };

        products.push(product);
    }

    res.send(products);
})
//-------------------------------------Mocking-----------------------------//

router.get('/resetPassword', viewsController.resetPassword)

router.get('/createNewPassword/:userId/:token', viewsController.createNewPassword)

router.get('/uploadDocs', isLogged, viewsController.uploadDocs)

router.get('/users/:userId', viewsController.modifyUser)

router.get('/', (req, res) => {
    res.redirect('/products')
})

router.get('/usersList', viewsController.getUsers)