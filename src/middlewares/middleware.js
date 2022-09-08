const isAuth = (req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect('/login');
	}
};

const isLogged = (req, res, next) => {
	if (!req.isAuthenticated()) {
		next();
	} else {
		res.redirect('/content');
	}
};

export { isAuth, isLogged };
