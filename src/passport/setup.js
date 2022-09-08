import bcrypt from 'bcrypt';
import User from '../models/Users.js';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

passport.serializeUser((user, done) => {
	done(null, user.username);
});

passport.deserializeUser((username, done) => {
	User.findOne({ username: username }, function (err, user) {
		done(err, user);
	});
});

passport.use(
	'register',
	new LocalStrategy(
		{
			passReqToCallback: true,
		},
		(req, username, password, done) => {
			User.findOne({ username: username })
				.then((user) => {
					if (!user) {
						const newUser = new User({ username, password });
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
		},
		(req, username, password, done) => {
			User.findOne({ username: username })
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
