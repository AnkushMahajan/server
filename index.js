// Main starting point of the application
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');

// middle wares in express { any incoming request needs to be passed through bodyParser and morgan }
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
mongoose.connect('mongodb://localhost/auth');

// App set up { app.use registers middleware }, morgan is a logging framework
app.use(morgan('combined'));
app.use(bodyParser.json({type: '*/*'}));
router(app);


// Server set up
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening at ', port);

 