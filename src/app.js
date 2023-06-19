const express = require('express');
const {engine} = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const viewsRouter = require('./routes/views.router.js');
const chatRouter = require('./routes/chat.router.js');
const authRouter = require('./routes/auth.router.js');

const {connectSocket} = require('./utils.js');
const {connectMongo} = require('./utils.js');

const app = express();
const port = 8080

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("src/public"));
app.use(session({
        store: MongoStore.create({mongoUrl: 'mongodb+srv://jeanpierrecarrey:09lcQ3OehxvKzocQ@backendcoder.nkbcjia.mongodb.net/ecommerce?retryWrites=true&w=majority', ttl: 3600}),
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
);

app.engine('handlebars', engine());
app.set('view engine', '.handlebars');
app.set('views', 'src/views');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use("/chat", chatRouter);
app.use('/auth', authRouter);
app.get("*", (req, res) => {
	return res.status(404).json({
        status: "error",
        msg: "no encontrado",
        data: {},
    });
});

const httpServer = app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}/auth/login`)
});

connectMongo();
connectSocket(httpServer);

/* authRouter.get('/products', (req, res) => {
    if (req.session.email) {
        UserModel.findOne({email: req.session.email})
        .then(user => {
            if (user) {
                res.render('products', {user: {firstName: user.firstName, lastName: user.lastName, email: user.email, isAdmin: user.isAdmin}});
            } else {
                res.render('products', {user: null});
            }
        })
        .catch(error => {
            console.error(error);
            res.render('products', {user: null, error: 'Error retrieving user data'});
        });
    } else {
        res.render('products', {user: null});
    }
}); */