import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import jsonwebtoken from 'jsonwebtoken';
import routes from './src/routes/crmRoutes';
import dotenv from 'dotenv'

// const dotenv = require('dotenv').config();
dotenv.config({ path: './config.env' });
const app = express();
const PORT = 3000;

// mongoose connection
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://a951racer:Jeg22713@cluster0-shard-00-00-uvnf1.mongodb.net:27017,cluster0-shard-00-01-uvnf1.mongodb.net:27017,cluster0-shard-00-02-uvnf1.mongodb.net:27017/crm?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true', {
let conn_string = 'mongodb://';
conn_string += process.env.DB_USER + ':';
conn_string += process.env.DB_PASSWORD + '@';
conn_string += process.env.DB_CLUSTER + '/';
conn_string += process.env.DB_NAME + '?';
conn_string += process.env.DB_OPTIONS;
console.log(conn_string);
mongoose.connect(conn_string, {
    useMongoClient: true
});

// bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// JWT setup
app.use((req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
       jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', (err, decode) => {  // RESTFULAPIs is a secret phrase, move to env vars
           if (err) req.user = undefined;
           req.user = decode;
           next();
       }); 
    } else {
        req.user = undefined;
        next();
    }
});

routes(app);

// serving static files
app.use(express.static('public'));

app.get('/', (req, res) =>
    res.send(`Node and express server is running on port ${PORT}`)
);

app.listen(PORT, () =>
    console.log(`your server is running on port ${PORT}`)
);