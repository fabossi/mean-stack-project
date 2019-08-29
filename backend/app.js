const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const postsRoute = require('./routes/post.route');
const usersRoute = require('./routes/user.route');
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(
  "mongodb+srv://" + process.env.user_mongo + ":" + process.env.pw_mongo +
  "@fabossi-website-7jcsx.mongodb.net/meanStack?retryWrites=true&w=majority",
  { useNewUrlParser: true })
  .then(() => {
    console.log('connected');
  }).catch(err => console.error(err));


app.use('/images', express.static(path.join('backend/images')));
app.use('/api/', postsRoute);
app.use('/api/', usersRoute);

module.exports = app;
