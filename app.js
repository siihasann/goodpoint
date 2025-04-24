const ejsMate = require('ejs-mate');
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ErrorHandler = require('./utils/ErrorHandler');

const path = require('path');
const app = express();

const { console } = require('inspector');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/bestpoints')
    .then((result) => { 
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.log('Error connecting to MongoDB:', err);
    });

app.engine('ejs', ejsMate); // Use ejs-mate for layout support
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));     


app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

app.use('/places', require('./routes/places'));
app.use('/places/:place_id/reviews', require('./routes/reviews'));


app.use((req, res, next) => {
  next(new ErrorHandler());
});

// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!';
  res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});