import { Router } from 'express';
import { fork } from 'child_process';
import path from 'path';
import logger from '../logger/logger.js';
const routerOperation = new Router();

routerOperation.get('/api/randoms', (req, res) => {
	const { method, url } = req;
	logger.info(` Peticion a ${method} ${url} recibida`);
	const { cant = 100000000 } = req.query
	const forked = fork(path.resolve('src/randomOperation.js'));
	forked.on('message', (msg) => {
		if (msg == 'OK') {
			forked.send(cant);
		} else {
			res.json(msg);
		}
	});
});

export default routerOperation;
