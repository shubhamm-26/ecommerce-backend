const express = require('express');
require('dotenv').config();
const passport = require('./middlewares/passport')
const session = require('express-session');
require("./utils/db");
const cors = require('cors');
const requestLogger = require('./middlewares/requestLogger');

const app = express();
app.use(requestLogger);

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
  }));

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(express.json());
app.options('*', cors());

app.use('/auth', require('./routes/authRoutes'));
app.use('/products', require('./routes/productRoutes'));
app.use('/cart', require('./routes/cartRoutes'));
app.use('/orders', require('./routes/orderRoutes'));
app.use('/payments', require('./routes/paymentRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});