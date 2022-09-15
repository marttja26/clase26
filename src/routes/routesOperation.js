import { Router } from 'express';
import { fork } from 'child_process';
import path from 'path';

const routerOperation = new Router();

routerOperation.get('/api/randoms', (req, res) => {
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
