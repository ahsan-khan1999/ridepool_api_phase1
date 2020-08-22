const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes')
var authenticate = require('../authenticate')
const dishRouter = express.Router();
const cors = require('./cors')
dishRouter.use(bodyParser.json());
dishRouter.route('/')
// .all( (req,res,next) => {
//     res.statusCode = 200
//     res.setHeader('Content_Types', 'text/plain');
//     next();u
// })
.options(cors.corsWithOptions,(req,res) => res.statusCode(200))

.get(cors.cors,( req,res,next ) => {
    Dishes.find({})
    .populate('comments.author')
    .then((dish) => {
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json(dish)
    },(err) => 
      next(err)
    );
})

.post(cors.corsWithOptions,authenticate.verifyUser ,authenticate.verifyAdmin,(req , res, next) => {
    Dishes.create(req.body)
    .then((dish) => {
      console.log('Dish Posted Is' ,dish)
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json(dish)
    },(err) => 
    
      next(err)
    );
})
.put(cors.corsWithOptions ,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>{
  res.statusCode = 404;
  res.end('Put Operation Is Not Allowed!')
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
  Dishes.remove({})
  .then((dish) => {
    console.log('Deleted Dish Is ' ,dish)
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(dish)
  },(err) =>
    next(err)
  );
});
dishRouter.route('/:dishId')
.options(cors.corsWithOptions,(req,res) => res.statusCode(200))
.get(cors.cors,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
      res.statusCode = 200;
      res.setHeader('Content_Type', 'application/json');
      res.json(dish)
    },(err) => {
      next(err);
    })
})

.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
  Dishes.findByIdAndUpdate(req.params.dishId,{
    $set : req.body
  },{ new:true})
  .then((dish) =>{
    res.statusCode = 200;
    res.setHeader('Content_Type','application/json');
    res.json(dish)
  },(err) => next(err));
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((dish) => {
      res.statusCode = 200
      res.setHeader('Content_Type', 'application/json');
      res.json(dish);

    },(err) => next(err));
});

dishRouter.route('/:dishId/comments')
.options(cors.corsWithOptions,(req,res) => res.statusCode(200))
.get(cors.cors ,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) =>{
      if(dish != null){
        Dishes.findById(dish._id)
          .populate('comments.author')
            .then((dish) => {
              res.statusCode = 200;
              // res.setHeader('Content_Type','application/json');
              res.json(dish.comments);
            },(err) => next(err));
        
      }
      else{
        err = new Error('Dish' , req.params.dishId + 'Not Found');
        err.status = 404;
        return next(err);
      }
    },(err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
      
      if(dish != null){
        console.log(dish)
        req.body.author = req.user._id;
        dish.comments.push(req.body);
        dish.save()
        .then((dish) => {
          res.statusCode = 200;
          res.setHeader('Content_Type','application/json');
          res.json(dish);
          console.log(dish);
        },(err) => next(err))
        
      }
      else{
        console.log(dish)
        err = new Error('Dish Doesnt Exist ', req.params.dishId)
        err.status = 404
        return next(err)
      }
    },(err) => next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
  res.statusCode = 403;
  res.end('Put operation Is not supported on /dishes/' + req.params.dishId + '/comments');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  Dishes.findById(req.params.dishId)
  .then((dish) => {
      if (dish != null) {
          for (var i = (dish.comments.length -1); i >= 0; i--) {
              dish.comments.id(dish.comments[i]._id).remove();
          }
          dish.save()
          .then((dish) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(dish);                
          }, (err) => next(err));
      }
      else {
          err = new Error('Dish ' + req.params.dishId + ' not found');
          err.status = 404;
          return next(err);
      }
  }, (err) => next(err))
  .catch((err) => next(err));    
});

dishRouter.route('/:dishId/comments/:commentId')
.options(cors.corsWithOptions,(req,res) => res.statusCode(200))
.get(cors.cors,(req,res,next) => {
  Dishes.findById(req.params.dishId)
  .populate('comments.author')
  .then((dish) => {
    if(dish != null && dish.comments.id(req.params.commentId) != null){
      res.statusCode = 200;
      res.setHeader('Content_Type','application/json');
      res.json(dish.comments.id(req.params.commentId));
    }
    else if( dish == null){
      err = new Error('Dish ',req.params.dishId + 'Do Not Exists');
      err.status = 404
      return next(err);
    }
    else{
      err = new Error('Comment Id ',req.params.commentId + 'Do Not Exists');
      err.status = 404
      return next(err);
    }
  },(err) => next(err));

})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
  res.statusCode = 403;
  res.end('Post Operation is not supported' , req.params.commentId);
  
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
  Dishes.findById(req.params.dishId)
  .then((dish) => {
    if(dish != null && dish.comments.id(req.params.commentId) != null &&  dish.comments.id(req.params.commentId).author.toString() === req.user._id.toString()){
      if(req.body.rating){
        dish.comments.id(req.params.commentId).rating = req.body.rating;
      } 
      if(req.body.comment){
        dish.comments.id(req.params.commentId).comment = req.body.comment;
      }
      
      dish.save().then((dish) => {
        Dishes.findById(dish._id)
          .populate('comments.author')
            .then((dish) => {
              res.statusCode = 200;
              res.setHeader('Content_Type','application/json');
              res.json(dish);
            },(err) => next(err));
        

      },(err) => next(err));
       
    }
    else if( dish == null){
      err = new Error('Dish ',req.params.dishId + 'Do Not Exists');
      err.status = 404
      return next(err);
    }
    else if(dish.comments.id(req.params.commentId).author.toString() === req.user._id.toString()){
      err = new Error('Author ', +dish.comments.id(req.params.commentId).author.toString() +'Is Not Same you cant edit');
      err.status = 404
      return next(err);
    }
    else{
      err = new Error('Comment Id ',req.params.commentId + 'Do Not Exists');
      err.status = 404
      return next(err);
    }
  },(err) => next(err))  
  
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next) => {
  Dishes.findById(req.params.dishId)
  .then((dish)=> {
    if(dish != null && dish.comments.id(req.params.commentId) != null){
      dish.comments.id(req.params.commentId).remove();
      dish.save()
      .then((dish) => {
        Dishes.findById(dish._id)
          .populate('comments.author')
            .then((dish) => {
              res.statusCode = 200;
              res.setHeader('Content_Type','application/json');
              res.json(dish);
            },(err) => next(err));
      },(err) => next(err));
    }
    else if(dish == null){
      err = new Error('Dish ',req.params.dishId + 'Do Not Exists');
      err.status = 404
      return next(err);
    }
    else{
      err = new Error('Comment ',req.params.commentId + 'Do Not Exists');
      err.status = 404
      return next(err);
    }

  },(err) => next(err))
  
}); 


module.exports =    dishRouter;
  
