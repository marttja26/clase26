import { Router } from 'express';
import passport from 'passport';
import path from 'path';
import { isAuth, isLogged } from '../middlewares/middleware.js';

const routerUser = new Router();

routerUser.get('/', isAuth, (req, res, next) => {
	res.redirect('/content');
});

routerUser.get('/username', (req, res) => {
	res.json(req.session.passport.user);
});

routerUser.get('/logout', (req, res, next) => {
	req.session.destroy(function (err) {
		if (err) return next(err);
		res.redirect('/login');
	});
});

routerUser.post(
	'/register',
	passport.authenticate('register', {
		successRedirect: '/login',
		failureRedirect: '/failRegister',
	})
);

routerUser.get('/register', isLogged, (req, res) => {
	res.sendFile(path.resolve('public/register.html'));
});

routerUser.get('/failRegister', (req, res) => {
	res.sendFile(path.resolve('public/failRegister.html'));
});

routerUser.post(
	'/login',
	passport.authenticate('login', {
		successRedirect: '/content',
		failureRedirect: '/failLogin',
	})
);

routerUser.get('/login', isLogged, (req, res) => {
	res.sendFile(path.resolve('public/login.html'));
});

routerUser.get('/failLogin', (req, res) => {
	res.sendFile(path.resolve('public/failLogin.html'));
});

export default routerUser;
