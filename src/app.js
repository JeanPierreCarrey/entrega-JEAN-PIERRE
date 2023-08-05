const express = require('express');
const {engine} = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
require('dotenv').config();
const compression = require("express-compression");

const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const viewsRouter = require('./routes/views.router.js');
const chatRouter = require('./routes/chat.router.js');
const authRouter = require('./routes/auth.router.js');
const sessionsRouter = require('./routes/sessions.router.js');

const {connectSocket} = require('./utils.js');
const {connectMongo} = require('./utils.js');
const {iniPassport} = require('./config/passport.config.js');
const errorHandler = require("./middlewares/error.js");

const app = express();
app.use(compression({
        brotli: { enabled: true, zlib: {} },
    })
);
const port = process.env.PORT

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("src/public"));

const mongodbUrl = process.env.MONGODB_URL;
app.use(session({
    store: MongoStore.create({mongoUrl: mongodbUrl, ttl: 3600}),
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
})
);

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
app.use(errorHandler);
app.get("*", (req, res) => {
	return res.status(404).json({
        status: "error",
        msg: "not found",
        data: {},
    });
});

const httpServer = app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}/auth/login`)
});

connectMongo();
connectSocket(httpServer);