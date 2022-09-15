import bcrypt from 'bcrypt';
import User from '../models/Users.js';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

passport.serializeUser((user, done) => {
	done(null, user.email);
});

passport.deserializeUser((email, done) => {
	User.findOne({ email: email }, function (err, user) {
		done(err, user);
	});
});

passport.use(
	'register',
	new LocalStrategy(
		{
			passReqToCallback: true,
			usernameField: 'email'
		},
		(req, email, password, done) => {
			User.findOne({ email: email })
				.then((user) => {
					if (!user) {
						const newUser = new User({ email, password });
						bcrypt.genSalt(10, (err, salt) => {
							bcrypt.hash(newUser.password, salt, (err, hash) => {
								if (err) console.log(err);
								newUser.password = hash;
								newUser
									.save()
									.then((user) => {
										return done(null, user);
									})
									.catch((err) => {
										return done(null, false, { message: err });
									});
							});
						});
					} else {
						return done(null, false, { message: 'El usuario ya existe' });
					}
				})
				.catch((err) => {
					return done(null, false, { message: err });
				});
		}
	)
);

passport.use(
	'login',
	new LocalStrategy(
		{
			passReqToCallback: true,
			usernameField: 'email'
		},
		(req, email, password, done) => {
			User.findOne({ email: email })
				.then((user) => {
					if (!user) {
						return done(null, false, { message: 'El usuario no existe' });
					} else {
						bcrypt.compare(password, user.password, (err, result) => {
							if (err) console.log(err);
							if (result) {
								return done(null, user);
							} else {
								return done(null, false, { message: 'Contraseña incorrecta.' });
							}
						});
					}
				})
				.catch((err) => {
					return done(null, false, { message: err });
				});
		}
	)
);

export default passport;
