const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes')

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());
dishRouter.route('/')
// .all( (req,res,next) => {
//     res.statusCode = 200
//     res.setHeader('Content_Types', 'text/plain');
//     next();
// })

.get(( req,res,next ) => {
    Dishes.find({})
    .then((dish) => {
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json(dish)
    },(err) => {
      res.statusCode = 404;
      res.setHeader('Content-Type','text/plain');
      res.end('Error While Getting Dishes!',err)
      next(err);
    });
})

.post( (req , res, next) => {
    Dishes.create(req.body)
    .then((dish) => {
      console.log('Dish Posted Is' ,dish)
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json(dish)
    },(err) => {
      res.statusCode = 404;
      res.setHeader('Content-Type','text/plain');
      res.end('Error While Getting Dishes!',err)
      next(err);
    });
})
.put((req,res,next) =>{
  res.statusCode = 404;
  res.end('Put Operation Is Not Allowed!')
})
.delete((req,res,next) => {
  Dishes.remove({})
  .then((dish) => {
    console.log('Deleted Dish Is ' ,dish)
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(dish)
  },(err) => {
    res.statusCode = 404;
    res.setHeader('Content-Type','text/plain');
    res.end('Error While Deleting Dishes!',err)
    next(err);
  });
});
dishRouter.route('/:dishId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
      res.statusCode = 200;
      res.setHeader('Content_Type', 'application/json');
      res.json(dish)
    },(err) => {
      next(err);
    })
})

.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})

.put( (req, res, next) => {
  Dishes.findByIdAndUpdate(req.params.dishId,{
    $set : req.body
  },{ new:true})
  .then((dish) =>{
    res.statusCode = 200;
    res.setHeader('Content_Type','application/json');
    res.json(dish)
  },(err) => next(err));
})

.delete( (req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((dish) => {
      res.statusCode = 200
      res.setHeader('Content_Type', 'application/json');
      res.json(dish);

    },(err) => next(err));
});


module.exports =    dishRouter;
  
