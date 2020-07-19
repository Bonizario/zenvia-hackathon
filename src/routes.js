const express = require('express');
const ProductController = require('./controllers/ProductController');
const routes = express.Router();

routes.get('/', ProductController.index);

routes.get('/oferecer', ProductController.oferecer);
routes.get('/procurar', ProductController.procurar);

module.exports = routes;
