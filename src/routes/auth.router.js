const express = require('express');
const authRouter = express.Router();
const { UserModel } = require("../DAO/models/users.model.js"); //?
const {isUser, isAdmin} = require("../middlewares/auth.js");
const passport = require('passport');

authRouter.get('/session', (req, res) => {
    return res.send(JSON.stringify(req.session));
});

authRouter.get('/login', (req, res) => {
    return res.render("login", {});
});

authRouter.post('/login', passport.authenticate('login', { failureRedirect: '/auth/faillogin' }), async (req, res) => {
    if (!req.user) {
        return res.json({ error: 'invalid credentials' });
    }
    req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, isAdmin: req.user.isAdmin };

    return res.json({ msg: 'ok', payload: req.user });
});

authRouter.get('/faillogin', async (req, res) => {
    return res.json({ error: 'fail to login' });
});

/* authRouter.post('/login', async (req, res) => {
    try{
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).render('error', {error: 'email and password required'});
        }
        const isAdmin = email === 'adminCoder@coder.com' && password === 'adminCod3r123';
        if (isAdmin) {
            req.session.email = email;
            req.session.isAdmin = true;
            return res.redirect('/auth/products');
        }
        const foundUser = await UserModel.findOne({email: email});
        if (foundUser && isValidPassword(password, foundUser.password)) {
            req.session.email = foundUser.email;
            req.session.isAdmin = foundUser.isAdmin;
            return req.session.save(() => {
                return res.redirect('/auth/products');
            });
        }else{
            return res.status(401).render('error', {error:'wrong email or password'})
        }
    }catch(error){
        console.error(error);
        res.status(500).json({status: 'error', message: 'Internal server error'});
    }
}); */

authRouter.get('/register', (req, res) => {
    return res.render("register", {});
});

authRouter.post('/register', passport.authenticate('register', { failureRedirect: '/auth/failregister' }), (req, res) => {
    if (!req.user) {
        return res.json({ error: 'something went wrong' });
    }
    req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, isAdmin: req.user.isAdmin };

    return res.json({ msg: 'ok', payload: req.user });
});

authRouter.get('/failregister', async (req, res) => {
    return res.json({ error: 'fail to register' });
});

/* authRouter.post('/register', async (req, res) => {
    const {email, password, firstName, lastName} = req.body;
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).render('error', {error: 'Missing fields'});
    }
    const isAdmin = email === 'adminCoder@coder.com' && password === 'adminCod3r123';
    try {
        await UserModel.create({email: email, password: createHash(password), firstName: firstName, lastName: lastName, isAdmin: isAdmin});
        req.session.email = email;
        req.session.isAdmin = isAdmin;

        return res.redirect('/auth/profile');
    } catch (e) {
        console.log(e);
        return res.status(400).render('error', { error: 'User could not be created. Try another email'});
    }
}); */

authRouter.get('/products', (req, res) => {
    try{
        const user = UserModel.findOne({email: req.session.email});
        if (user) {
            const userData = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin,
            };
            return res.render('products', { user: userData });
        } else {
            return res.render('products', { user: null });
        }
    } catch (error) {
        console.error(error);
        return res.render('products', { user: null, error: 'Error retrieving user data' });
    }
});

authRouter.get('/profile', isUser, (req, res) => {
    const user = {email: req.session.email, isAdmin: req.session.isAdmin};
    return res.render('profile', {user: user});
});

authRouter.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
        return res.status(500).render('error', {error: 'session couldnt be closed'});
    }
        return res.redirect('/auth/login');
    });
});

authRouter.get('/administration', isUser, isAdmin, (req, res) => {
    return res.send('Data');
});

module.exports = authRouter;

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