const express = require('express')
const bodyParser = require('body-parser');
const multer = require('multer')
const authenticate = require('../authenticate')
const cors = require('./cors')
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const imageFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only Images Can Be Uploaded'), false);
    }
    cb(null, true);
};

const uploadFile = multer({ storage: diskStorage, fileFilter: imageFilter });

const uploadRoute = express.Router()
uploadRoute.use(bodyParser.json());

// cors.corsWithOptions,
uploadRoute.route('/')
.options((req,res) => res.statusCode(200))
// cors.cors,
    .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403
        res.end('Get Operation On This Route Is Not Valid')

    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403
        res.end('Put Operation On This Route Is Not Valid')

    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403
        res.end('delete Operation On This Route Is Not Valid')

    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, uploadFile.single('imageFile'), (req, res, next) => {
        res.statusCode = 200
        res.setHeader('Content_Type', 'application/json')
        res.json(req.file);

    })
module.exports = uploadRoute;

