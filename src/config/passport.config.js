const {createHash, isValidPassword} = require('../utils/utils.js');
const {UserModel} = require('../DAO/mongo/models/users.model.js');
const CartService = require('../services/carts.service.js');
const cartService = new CartService();
const logger = require("../utils/logger.js");

const passport = require('passport');
const local = require('passport-local');
const LocalStrategy = local.Strategy;
const GitHubStrategy = require('passport-github2');

require('dotenv').config();
const clientID = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET

function iniPassport() {
    passport.use(
        'login',
        new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
            try {
                const user = await UserModel.findOne({ email: username });
                if (!user) {
                    logger.debug('User Not Found with username (email) ' + username);
                    return done(null, false);
                }
                if (!isValidPassword(password, user.password)) {
                    logger.debug('Invalid Password');
                    return done(null, false);
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        })
    );

    passport.use(
        'register',
        new LocalStrategy(
            {
                passReqToCallback: true,
                usernameField: 'email',
            },
            async (req, username, password, done) => {
                try {
                    const { email, firstName, lastName, age } = req.body;
                    let user = await UserModel.findOne({ email: username });
                    if (user) {
                        logger.debug('User already exists');
                        return done(null, false);
                    }

                    const newCart = await cartService.createCart();
                    const cartID = newCart._id.toString();

                    const newUser = {
                        email,
                        firstName,
                        lastName,
                        age,
                        password: createHash(password),
                        cartID,
                        role: "user",
                    };

                    let userCreated = await UserModel.create(newUser);
                    logger.info('User Registration successful', { user: userCreated });
                    return done(null, userCreated);
                } catch (e) {
                    logger.error('Error in register', e);
                    return done(e);
                }
            }
        )
    );

    passport.use(
        'github',
        new GitHubStrategy(
            {
                clientID: clientID,
                clientSecret: clientSecret,
                callbackURL: 'http://localhost:8080/auth/githubcallback',
            },
            async (accessToken, _, profile, done) => {
                logger.debug(profile);
                try {
                    const res = await fetch('https://api.github.com/user/emails', {
                        headers: {
                            Accept: 'application/vnd.github+json',
                            Authorization: 'Bearer ' + accessToken,
                            'X-Github-Api-Version': '2022-11-28',
                        },
                    });
                    const emails = await res.json();
                    const emailDetail = emails.find((email) => email.verified == true);
    
                    if (!emailDetail) {
                        return done(new Error('cannot get a valid email for this user'));
                    }
                    profile.email = emailDetail.email;
    
                    let user = await UserModel.findOne({ email: profile.email });
                    if (!user) {
                        const newCart = await cartService.createCart();
                        const cartID = newCart._id.toString();

                        const newUser = {
                            email: profile.email,
                            firstName: profile._json.name || profile._json.login || 'noname',
                            lastName: 'nolast',
                            age: profile.age,
                            password: profile.password || '',
                            cartID: cartID || '',
                            role: "user",
                        };
                        let userCreated = await UserModel.create(newUser);
                        logger.info('User Registration succesful');
                        return done(null, userCreated);
                    } else {
                        logger.debug('User already exists');
                        return done(null, user);
                    }
                } catch (e) {
                    logger.error('Error in GitHub authentication', { error: e });
                    return done(e);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById(id);
        done(null, user);
    });
}

exports.iniPassport = iniPassport;