import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import jsonwebtoken from 'jsonwebtoken';
import routes from './src/routes/crmRoutes';
import dotenv from 'dotenv'

dotenv.config({ path: './config.env' });
const app = express();
const PORT = process.env.PORT;

// mongoose connection
mongoose.Promise = global.Promise;
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
       jsonwebtoken.verify(req.headers.authorization.split(' ')[1], process.env.SESSION_SECRET, (err, decode) => {
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