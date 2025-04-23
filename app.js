const ejsMate = require('ejs-mate');
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const wrapAsync = require('./utils/wrapAsync');
const ErrorHandler = require('./utils/ErrorHandler');
const Joi = require('joi');

const path = require('path');
const app = express();

// Models
const Place = require('./models/place');
const { title } = require('process');
const { console } = require('inspector');

// Schemas
const { placeSchema } = require('./schemas/place');
const Review = require('./models/review');


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

const validatePlace = (req, res, next) => {
  const { error } = placeSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    return next(new ErrorHandler(msg, 400));
  } else {
    next();
  }
}

app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

// Show all places
app.get('/places', wrapAsync (async (req, res) => { 
    const places = await Place.find();
    res.render('places/index', { places });
}))


// Create a new place
app.get('/places/create', (req, res) => {
    res.render('places/create');
})
// Handle form submission to create a new place
app.post('/places', validatePlace, wrapAsync(async (req, res, next) => { 
    const place = new Place(req.body.place);
    await place.save();
    res.redirect('/places');
}))


// Show a single place
app.get('/places/:id', wrapAsync (async (req, res) => {
  const place = await Place.findById(req.params.id);
  res.render('places/show', { place });
}))


// Update a place
app.get('/places/:id/edit', wrapAsync (async (req, res) =>{
  const place = await Place.findById(req.params.id);
  res.render('places/edit', { place });
}))
// Handle form submission to update a place
app.put('/places/:id', validatePlace, wrapAsync (async (req, res) => { 
  await Place.findByIdAndUpdate(req.params.id, {...req.body.place});
  res.redirect(`/places/${req.params.id}`);
}))


// Delete a place
app.delete('/places/:id', wrapAsync (async (req, res) => {
  await Place.findByIdAndDelete(req.params.id);
  res.redirect('/places');
}))


// Review a place
app.post('/places/:id/reviews', wrapAsync(async (req, res) => {
  const review = new Review(req.body.review);
  const place = await Place.findById(req.params.id);
  place.reviews.push(review);
  await review.save();
  await place.save();
  res.redirect(`/places/${req.params.id}`);
}))


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