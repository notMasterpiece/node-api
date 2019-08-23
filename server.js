require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.static(`${__dirname}/static`));

process.on('uncaughtException', err => {
  //TODO log error

  console.log('UNCAUGHT EXCEPTION:', err.stack);
  process.exit(1);
});



require('./middelwares')(app);
require('./routes')(app);


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  }).then(() => {
  console.log('App connected to mongodb');
});


const server = app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}...`);
});


process.on('unhandledRejection', err => {

  //TODO log error

  console.log('UNHANDLED REJECTION', err.name, err.message, err.stack);

  server.close(() => process.exit(1));


});






// 94
// 101
// 102
// 130
// 148