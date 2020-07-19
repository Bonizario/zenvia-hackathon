const express = require('express');
const nunjucks = require('nunjucks');
const cors = require('cors');
const routes = require('./routes');

const server = express();

server.use(express.json());
server.use(cors());
server.use(routes);
server.use(express.urlencoded({ extended: true }));
server.use(express.static('public'));

server.set('view engine', 'njk');

nunjucks.configure('src/views', {
  express: server,
  autoescape: false,
  noCache: true,
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log('Server is running on port: 5000');
});
