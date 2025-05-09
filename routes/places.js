const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const ErrorHandler = require('../utils/ErrorHandler');
const Place = require('../models/place');
const { placeSchema } = require('../schemas/place');
const isValidObjectId = require('../middlewares/isValidObjectId');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();

// Middleware for validating place data
const validatePlace = (req, res, next) => {
    const { error } = placeSchema.validate(req.body);
    if (error) {
      const msg = error.details.map(el => el.message).join(',');
      return next(new ErrorHandler(msg, 400));
    } else {
      next();
    }
  }

// Show all places
router.get('/', wrapAsync (async (req, res) => { 
    const places = await Place.find();
    res.render('places/index', { places });
}))


// Create a new place
router.get('/create', isAuth, (req, res) => {
    res.render('places/create');
})
// Handle form submission to create a new place
router.post('/', isAuth, validatePlace, wrapAsync(async (req, res, next) => { 
    const place = new Place(req.body.place);
    await place.save();
    req.flash('success_msg', 'Successfully created a new place!');
    res.redirect('/places');
}))


// Show a single place
router.get('/:id', isValidObjectId('/places'), wrapAsync (async (req, res) => {
  const place = await Place.findById(req.params.id).populate('reviews');
  res.render('places/show', { place });
}))


// Update a place
router.get('/:id/edit', isAuth, isValidObjectId('/places'), wrapAsync (async (req, res) =>{
  const place = await Place.findById(req.params.id);
  res.render('places/edit', { place });
}))
// Handle form submission to update a place
router.put('/:id', isAuth, isValidObjectId('/places'), validatePlace, wrapAsync (async (req, res) => { 
  await Place.findByIdAndUpdate(req.params.id, { ...req.body.place });
  req.flash('success_msg', 'Place updated successfully!');
  res.redirect(`/places/${req.params.id}`);
}))


// Delete a place
router.delete('/:id', isAuth, isValidObjectId('/places'), wrapAsync (async (req, res) => {
  await Place.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Place deleted successfully!');
  res.redirect('/places');
}))

module.exports = router;