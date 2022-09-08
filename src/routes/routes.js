import { Router } from 'express';
import passport from 'passport';
import path from 'path';
import { isAuth, isLogged } from '../middlewares/middleware.js';

const router = new Router();

router.get('/', isAuth, (req, res, next) => {
	console.log('hola me trabe aca');
	res.redirect('/content');
});

router.get('/username', (req, res) => {
	res.json(req.session.passport.user);
});

router.get('/logout', (req, res, next) => {
	req.session.destroy(function (err) {
		if (err) return next(err);
		res.redirect('/login');
	});
});

router.post(
	'/register',
	passport.authenticate('register', {
		successRedirect: '/login',
		failureRedirect: '/failRegister',
	})
);

router.get('/register', isLogged, (req, res) => {
	res.sendFile(path.resolve('public/register.html'));
});

router.get('/failRegister', (req, res) => {
	res.sendFile(path.resolve('public/failRegister.html'));
});

router.post(
	'/login',
	passport.authenticate('login', {
		successRedirect: '/content',
		failureRedirect: '/failLogin',
	})
);

router.get('/login', isLogged, (req, res) => {
	res.sendFile(path.resolve('public/login.html'));
});

router.get('/failLogin', (req, res) => {
	res.sendFile(path.resolve('public/failLogin.html'));
});

export default router;
