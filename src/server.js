import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import session from 'express-session';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import router from './routes/routes.js';
import ContainerFake from './containers/ContainerFake.js';
import ContainerFs from './containers/ContainerFs.js';
import passport from './passport/setup.js';
import { isAuth } from './middlewares/middleware.js';
const app = express();

mongoose
	.connect(process.env.MONGO_URL, {
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
			mongoUrl: process.env.MONGO_URL,
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

const productsApi = new ContainerFake();
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

app.get('/api/productos-test', (req, res) => {
	res.json(productsApi.getProducts(5));
});

app.use('/', router);

const PORT = process.env.PORT || 8080;

const srv = server.listen(PORT, () => {
	console.log(
		`Servidor Http con Websockets escuchando en el puerto ${srv.address().port}`
	);
});
srv.on('error', (error) => console.log(`Error en servidor ${error}`));
