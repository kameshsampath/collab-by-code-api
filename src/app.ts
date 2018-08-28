
import env from 'dotenv';
env.config();

import * as util from 'util';
import * as cors from 'cors';

import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

import express from 'express';
import bodyParser from 'body-parser';

//Set up express
export const app = express();
app.set("port", process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set("ip", process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');

//Middlware
app.use(cors.default({origin: '*'}));
app.use(bodyParser.json());

//App Config
app.set('dbHost', process.env.DB_HOST);
app.set('dbPort', process.env.DB_PORT);
app.set('dbURL',  util.format("mongodb://%s:%s", app.get('dbHost'), app.get('dbPort')));
app.set('dbName', process.env.DB_NAME);
app.set('dbUser', process.env.DB_USER);
app.set('dbUserPassword', process.env.DB_USER_PASSWORD);

export const mongooseConn = mongoose.connect(app.get('dbURL'), {
  dbName: app.get('dbName'),
  auth: {
    user: app.get('dbUser'),
    password: app.get('dbUserPassword')
  }
});

//Questions routes
import './api/questions';

//Quiz routes
import './api/quiz';

//Start the server
mongooseConn.then((conn) => {
  console.log(`\n  Connection with DB: "${app.get('dbURL')}" established successfully.`);
  app.listen(app.get("port"), () => {
    console.log(
      "\n  App is running at http://localhost:%d in %s mode.",
      app.get("port"),
      app.get("env")
    );
    console.log("\n  Press CTRL-C to stop\n");
  });
}).catch((err) => console.log(err));