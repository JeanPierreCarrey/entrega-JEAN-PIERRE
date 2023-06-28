const express = require('express');
const {engine} = require('express-handlebars');
//require('dotenv').config();
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');

const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const viewsRouter = require('./routes/views.router.js');
const chatRouter = require('./routes/chat.router.js');
const authRouter = require('./routes/auth.router.js');
const sessionsRouter = require('./routes/sessions.router.js');

const {connectSocket} = require('./utils.js');
const {connectMongo} = require('./utils.js');
const {iniPassport} = require('./config/passport.config.js')

const app = express();
const port = 8080

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("src/public"));

/* const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;
const DB_NAME = process.env.DB_NAME; */
app.use(session({
    store: MongoStore.create({mongoUrl: 'mongodb+srv://jeanpierrecarrey:09lcQ3OehxvKzocQ@backendcoder.nkbcjia.mongodb.net/ecommerce?retryWrites=true&w=majority', ttl: 3600}),
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
})
);

/* const sessionStore = new MongoStore({
    mongoUrl: process.env.MONGODB_URL,
    mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    },
    ttl: 3600,
});

app.use(
    session({
    store: sessionStore,
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    })
  ); */

iniPassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', engine());
app.set('view engine', '.handlebars');
app.set('views', 'src/views');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use("/chat", chatRouter);
app.use('/auth', authRouter);
app.use('/api/sessions', sessionsRouter);
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