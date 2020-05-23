const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routerUser = require('./app/controllers/userController');
const routerTravel = require('./app/controllers/travelController');
const routerAuth = require('./app/controllers/authController'); 


//configuração do body-parser

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//configuração dos grupos de rotas

app.use('/users', routerUser);
app.use('/users/travels', routerTravel);
app.use('/auth', routerAuth);

app.listen(4000);