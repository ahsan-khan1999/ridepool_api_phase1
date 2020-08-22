const express = require('express');
const bodyParser = require('body-parser');
const mongoose =  require('mongoose');
const Leader = require('../models/leader')
var authenticate = require('../authenticate')
const leaderRoute = express.Router();
const cors = require('./cors')
leaderRoute.use(bodyParser.json());
leaderRoute.route('/')
.options(cors.corsWithOptions,(req,res) => res.statusCode(200))
.get(cors.cors ,( req,res,next ) => {
    Leader.find({})
    .then((leader) => {
      res.statusCode = 200
    res.setHeader('Content_Types', 'text/plain');
    res.json(leader);
    },(err) => next(err));
})

.post(cors.corsWithOptions , authenticate.verifyUser,authenticate.verifyAdmin,(req , res, next) => {
    Leader.create(req.body).then((leader) => {
      res.statusCode = 200
    res.setHeader('Content_Types', 'text/plain');
    res.json(leader);
    },(err) => next(err));
})
.put(cors.corsWithOptions ,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
  res.statusCode = 403
  res.end('Put Do not work in Leader');
})
.delete(cors.corsWithOptions ,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
  Leader.remove({}).then((leader) => {
    res.statusCode = 200
    res.setHeader('Content_Types', 'text/plain');
    res.json(leader);
  },(err) =>  next(err));
})

leaderRoute.route('/:leaderId')
.options(cors.corsWithOptions,(req,res) => res.statusCode(200))
.get(cors.cors,(req,res,next) => {
    Leader.findById(req.params.leaderId).then((leader) => {
      res.statusCode = 200
    res.setHeader('Content_Types', 'text/plain');
    res.json(leader);
    },(err) => next(err));
})

.post(cors.corsWithOptions ,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /Leader/'+ req.params.leaderId);
})

.put(cors.corsWithOptions , authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  Leader.findByIdAndUpdate(req.params.leaderId,{ $set : req.body} , { new:true}).then((leader) => {
    res.statusCode = 200
    res.setHeader('Content_Types', 'text/plain');
    res.json(leader);
  },(err) => next(err));
})

.delete(cors.corsWithOptions ,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Leader.findByIdAndRemove(req.params.leaderId).then((leader) => {
      res.statusCode = 200
    res.setHeader('Content_Types', 'text/plain');
    res.json(leader);
    },(err) => next(err));
});


module.exports =    leaderRoute;
