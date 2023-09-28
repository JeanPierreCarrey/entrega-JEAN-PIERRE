const express = require('express');
const {engine} = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
require('dotenv').config();
const compression = require("express-compression");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUiExpress = require('swagger-ui-express');

const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');
const viewsRouter = require('./routes/views.router.js');
const chatRouter = require('./routes/chat.router.js');
const authRouter = require('./routes/auth.router.js');
const sessionsRouter = require('./routes/sessions.router.js');
const usersRoleRouter = require('./routes/usersRole.router.js');

const {connectSocket} = require('./utils/utils.js');
const {connectMongo} = require('./utils/utils.js');
const {iniPassport} = require('./config/passport.config.js');
const errorHandler = require("./middlewares/error.js");
const logger = require("./utils/logger.js");

const app = express();
app.use(compression({
        brotli: { enabled: true, zlib: {} },
    })
);
const port = process.env.PORT

app.use(errorHandler);
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

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentacion Ecommerce",
            description: "Este proyecto es un ecommerce",
        },
    },
    apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use("/chat", chatRouter);
app.use('/auth', authRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRoleRouter);
app.get("*", (req, res) => {
	return res.status(404).json({
        status: "error",
        msg: "not found",
        data: {},
    });
});

const httpServer = app.listen(port, () => {
    logger.info(`Server running on port http://localhost:${port}/auth/login`)
});

connectMongo();
connectSocket(httpServer);

module.exports = app;