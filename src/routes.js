const express = require('express');
const ProductController = require('./controllers/ProductController');

const routes = express.Router();

routes.get('/', ProductController.index);

routes.post('/oferecer', ProductController.oferecer);
routes.post('/procurar', ProductController.procurar);

module.exports = routes;
