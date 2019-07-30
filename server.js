const express = require('express'); // importing a CommonJS module

const hubsRouter = require('./hubs/hubs-router.js');
const helmet = require('helmet');
const logger = require('morgan');

const server = express();

//NB Order of Middleware Application is BIG DEAL
server.use(logger('dev'));
server.use(methodLogger);
server.use(express.json());
server.use('/api/hubs', hubsRouter);
server.use(helmet()); //add at the end to blanket cover, //obscures headers (see Postman)
server.use(addName);
server.use(gateKeeper);
//server.use(lockout);


server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';
  console.log("TEST", req.header('X-mycustomname'))
  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

function methodLogger(req, res, next){
  console.log(`${req.method} request received.`);
  next();
}

function addName(req,res,next){
  req.name = 'sk';
  next();
}

function lockout(req, res, next){
  res.status(403).json({message: "API locked out"});
}

function gateKeeper (req, res, next){
  let currentSeconds = new Date().getSeconds();
  console.log('the seconds is:', currentSeconds);
  if (currentSeconds % 3 === 0){
    res.status(403).json({message: 'I hate 3...'})
  } else {
    next()
  }
}




module.exports = server;
