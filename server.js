const express = require('express');
const connection = require('./connection');
const cors = require('cors');
const jwt = require('jsonwebtoken');

//auhentification
// const bodyParser = require('body-parser');
// const errorHandler = require('_middleware/error-handler');

// //authentification
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(cors());

require('dotenv').config();

//authentification
// api routes
// app.use('/users', require('./users/users.controller'));

// // global error handler
// app.use(errorHandler);


const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());



connection.connect((err) => {
    if (err) throw err;
    else console.log('Connected to Database...')
});


const clientRouter = require('./routes/client');
app.use('/client', clientRouter);

const produitClientRouter = require('./routes/produitClient');
app.use('/produitClient', produitClientRouter);

const reclamationsRouter = require('./routes/reclamations');
app.use('/reclamations', reclamationsRouter);

const produitRouter = require('./routes/produit');
app.use('/produit', produitRouter);

const revendeurRouter = require('./routes/revendeur');
app.use('/revendeur', revendeurRouter);

const personnelRouter = require('./routes/personnel');
app.use('/personnel', personnelRouter);

const adressRouter = require('./routes/adresse');
app.use('/adresse', adressRouter);
const activitesrouter = require('./routes/activites');
app.use('/activites', activitesrouter);
const authentificationRouter = require('./routes/authentification');
app.use('/authentification', authentificationRouter);

const paysRouter = require ('./routes/pays')
app.use('/pays', paysRouter);

app.listen(port, () => {
    console.log(`Server is Running on port ${port}...`);
});