const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
const cors = require('cors')

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const bebeRouter = require('./routes/bebe');
const babyBottleRouter = require('./routes/baby-bottle');
const diaperRouter = require('./routes/diaper')
const vaccineRouter = require('./routes/vaccine')
/*
const biberonRouter = require('./routes/auth');
const coucheRouter = require('./routes/auth');
const medecinRouter = require('./routes/auth');
const medicamentRouter = require('./routes/auth');
const poidsRouter = require('./routes/auth');
const repasouter = require('./routes/auth');
const sommeilRouter = require('./routes/auth');
const tailleRouter = require('./routes/auth');
const temperatureRouter = require('./routes/auth');
const teteRouter = require('./routes/auth');
const vaccinRouter = require('./routes/auth');*/

const app = express();
app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

//dbconnection
mongoose.connect(
    'mongodb://bebev1:8DK0HIy6bv88vuDV@bebev1-shard-00-00-ciok6.mongodb.net:27017,bebev1-shard-00-01-ciok6.mongodb.net:27017,bebev1-shard-00-02-ciok6.mongodb.net:27017/test?ssl=true&replicaSet=bebev1-shard-0&authSource=admin&retryWrites=true&w=majority'
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log('connected to database');
});

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/bebes', bebeRouter);
app.use('/api/baby-bottle', babyBottleRouter);
app.use('/api/diaper', diaperRouter);
app.use('/api/vaccine', vaccineRouter);

module.exports = app;
