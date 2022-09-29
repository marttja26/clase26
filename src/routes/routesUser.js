import { Router } from 'express';
import passport from 'passport';
import path from 'path';
import { isAuth, isLogged } from '../middlewares/middleware.js';
import logger from '../logger/logger.js';


const routerUser = new Router();

routerUser.get('/', isAuth, (req, res, next) => {
	const { method, url } = req;
	logger.info(` Peticion a ${method} ${url} recibida`);
	res.redirect('/content');
});

routerUser.get('/username', (req, res) => {
	const { method, url } = req;
	logger.info(` Peticion a ${method} ${url} recibida`);
	res.json(req.session.passport.user);
});

routerUser.get('/logout', (req, res, next) => {
	const { method, url } = req;
	logger.info(` Peticion a ${method} ${url} recibida`);
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
	const { method, url } = req;
	logger.info(` Peticion a ${method} ${url} recibida`);
	res.sendFile(path.resolve('public/register.html'));
});

routerUser.get('/failRegister', (req, res) => {
	const { method, url } = req;
	logger.info(` Peticion a ${method} ${url} recibida`);
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
	const { method, url } = req;
	logger.info(` Peticion a ${method} ${url} recibida`);
	res.sendFile(path.resolve('public/login.html'));
});

routerUser.get('/failLogin', (req, res) => {
	const { method, url } = req;
	logger.info(` Peticion a ${method} ${url} recibida`);
	res.sendFile(path.resolve('public/failLogin.html'));
});

export default routerUser;
