const express = require('express');
const ProductController = require('./controllers/ProductController');
const routes = express.Router();

routes.get('/', ProductController.index);

routes.get('/test', ProductController.search);

module.exports = routes;
