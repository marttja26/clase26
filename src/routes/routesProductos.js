import { Router } from 'express';
import ContainerFake from '../containers/ContainerFake.js';

const routerProductos = new Router();

const productsApi = new ContainerFake();

routerProductos.get('/api/productos-test', (req, res) => {
	res.json(productsApi.getProducts(5));
});

export default routerProductos;
