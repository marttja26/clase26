import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { config } from './config.js';
import express from 'express';
import session from 'express-session';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import routerUser from './routes/routesUser.js';
import routerOperation from './routes/routesOperation.js';
import routerProductos from './routes/routesProductos.js';
import ContainerFs from './containers/ContainerFs.js';
import passport from './passport/setup.js';
import { isAuth } from './middlewares/middleware.js';

const { PORT } = yargs(hideBin(process.argv))
	.alias({ p: 'PORT' })
	.default({ PORT: 8080 }).argv;

const app = express();
mongoose
	.connect(config.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(console.log('conectado a la DB'))
	.catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	session({
		store: MongoStore.create({
			mongoUrl: config.MONGO_URL,
			mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
		}),

		secret: 'secret',
		resave: false,
		saveUninitialized: true,
		rolling: true,
		cookie: {
			maxAge: 1000 * 60 * 10,
		},
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/content/*', isAuth);
app.use('/content', express.static('public'));

const server = http.createServer(app);
const io = new Server(server);

const messagesApi = new ContainerFs('./mensajes.json');

io.on('connection', async (socket) => {
	console.log('Un cliente se ha conectado');
	const chat = await messagesApi.getNormalizedMensajes();
	socket.emit('chat', chat);

	socket.on('new-message', async (data) => {
		await messagesApi.save(data);
		const chat = await messagesApi.getNormalizedMensajes();
		io.sockets.emit('chat', chat);
	});
});

app.get('/info', (req, res) => {
	res.json({
		'Argumentos de Entrada': process.argv.splice(2), // O  yargs(hideBin(process.argv)).argv ---NO SE CUAL DEBERIA USAR---
		'Sistema Operativo': process.platform,
		'Version de node.js': process.version,
		'Memoria total reservada': process.rss,
		'Path de ejecucion': process.execPath,
		'Process id': process.pid,
		'Carpeta del proyecto': process.argv[1],
	});
});

app.use('/', routerUser);
app.use('/', routerProductos);
app.use('/', routerOperation);

const srv = server.listen(PORT, () => {
	console.log(
		`Servidor Http con Websockets escuchando en el puerto ${srv.address().port}`
	);
});
srv.on('error', (error) => console.log(`Error en servidor ${error}`));
