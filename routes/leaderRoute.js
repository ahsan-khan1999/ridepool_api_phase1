const express = require('express');
const bodyParser = require('body-parser');

const leaderRoute = express.Router();

leaderRoute.use(bodyParser.json());
leaderRoute.route('/')
.all( (req,res,next) => {
    res.statusCode = 200
    res.setHeader('Content_Types', 'text/plain');
    next();
})

.get(( req,res,next ) => {
    res.end('Get Req is here from leaderRoute route')
})

.post( (req , res, next) => {
    res.end('Name attach in req is '+ req.body.name);
});
leaderRoute.route('/:leaderId')
.all( (req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  next();
})

.get((req,res,next) => {
    res.end('Wills send details of the Leader: ' + req.params.leaderId +' to you!');
})

.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /Leader/'+ req.params.leaderId);
})

.put( (req, res, next) => {
  res.write('Updating the Leader: ' + req.params.leaderId + '\n');
  res.end('Will update the Leader: ' + req.body.name + 
        ' with details: ' + req.body.description);
})

.delete( (req, res, next) => {
    res.end('Deleting Leader: ' + req.params.leaderId);
});


module.exports =    leaderRoute;
