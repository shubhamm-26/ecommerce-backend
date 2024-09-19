const express = require('express');
require('dotenv').config();
const passport = require('./middlewares/passport')
const session = require('express-session');
require("./utils/db");
const cors = require('cors');

const app = express();

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
  }));

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(express.json());

app.use('/auth', require('./routes/authRoutes'));
app.use('/products', require('./routes/productRoutes'));
app.use('/cart', require('./routes/cartRoutes'));


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});