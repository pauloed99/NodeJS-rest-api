const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routerUser = require('./app/controllers/userController');
const routerTravel = require('./app/controllers/travelController');
const routerAuth = require('./app/controllers/authController'); 


//configuração do body-parser

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//configuração do cors

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method === 'OPTIONS'){
        res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, PATCH, GET");
        res.status(200).json({});
    }
        
    
    next();
});
  

//configuração dos grupos de rotas

app.use('/users', routerUser);
app.use('/users/travels', routerTravel);
app.use('/auth', routerAuth);


app.listen(4000);