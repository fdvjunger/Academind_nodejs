const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

const connection = (
    "mongodb://node-adm:"+process.env.MONGO_ATLAS_PW+"@node-rest-shop-shard-00-00-skffs.mongodb.net:27017,node-rest-shop-shard-00-01-skffs.mongodb.net:27017,node-rest-shop-shard-00-02-skffs.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin&retryWrites=false"     
);

mongoose.connect(
    connection,
    //"mongodb://node-adm:node-adm@node-rest-shop-shard-00-00-skffs.mongodb.net:27017,node-rest-shop-shard-00-01-skffs.mongodb.net:27017,node-rest-shop-shard-00-02-skffs.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin&retryWrites=true",
    {
    //useMongoClient:true
    }
)


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header(
        'Access-Constrol-Allow-Headers',
        'Origin, X-requested-with, Content-Type, Accept, Authoriztion'
    );
    if (req.method == 'OPTION'){
        res.header('Access-Constrol-Allow-Methods','PUT, POST PATCH, DELETE, GET');
        return  res.status(200).json({});
    }
    next();
});

//routes with handle requests
app.use('/products',productRoutes);
app.use('/orders',ordersRoutes);

//handle errors
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status ||500 );
    res.json({
        error:{
            message: error.message
        }
    });
});


module.exports=app;