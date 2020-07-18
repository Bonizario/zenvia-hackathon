const express = require('express');
const routes = require('./routes');

const server = express();

server.use(routes);

server.listen(5000, () => {
  console.log('Server is running on port: 5000');
});
