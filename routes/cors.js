const express = require('express');
const cors = require('cors');
const app = express();

const originList = ['http://localhost:3000','https://localhost:3443'];

var corsOptions = (req,cb) => {
    var corsOption = {};

    if(originList.indexOf(req.header('origin')) !== -1){
        corsOption = {
            origin:true
        }

    }
    else{
        corsOption ={ origin: false}
    }
    cb(null,corsOption);
}

module.exports.cors = cors(); // it will go with * all 
module.exports.corsWithOptions = cors(corsOptions);