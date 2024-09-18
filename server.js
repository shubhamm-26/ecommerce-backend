const express = require('express');
require('dotenv').config();
require("./db");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', require('./routes/authRoutes'));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});