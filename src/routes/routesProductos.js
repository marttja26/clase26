import { Router } from 'express';
import ContainerFake from '../containers/ContainerFake.js';
import logger from '../logger/logger.js';

const routerProductos = new Router();

const productsApi = new ContainerFake();

routerProductos.get('/api/productos-test', (req, res) => {
	const { method, url } = req;
	logger.info(` Peticion a ${method} ${url} recibida`);
	res.json(productsApi.getProducts(5));
});

export default routerProductos;
