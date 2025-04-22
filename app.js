const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const path = require('path');
const app = express();

// Models
const Place = require('./models/place');


// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/bestpoints')
    .then((result) => { 
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.log('Error connecting to MongoDB:', err);
    });


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));     


app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

// Show all places
app.get('/places', async (req, res) => { 
    const places = await Place.find();
    res.render('places/index', { places });
})


// Create a new place
app.get('/places/create', (req, res) => {
    res.render('places/create');
})
// Handle form submission to create a new place
app.post('/places', async (req, res) => { 
    const place = new Place(req.body.place);
    await place.save();
    res.redirect('/places');
})


// Show a single place
app.get('/places/:id', async (req, res) => {
  const place = await Place.findById(req.params.id);
  res.render('places/show', { place });
})


// Update a place
app.get('/places/:id/edit', async (req, res) =>{
  const place = await Place.findById(req.params.id);
  res.render('places/edit', { place });
})
// Handle form submission to update a place
app.put('/places/:id', async (req, res) => { 
  await Place.findByIdAndUpdate(req.params.id, {...req.body.place});
  res.redirect(`/places/${req.params.id}`);
})

// app.get('/seed/place', async (req, res) => { 
//     const place = new Place({
//         title: 'Sample Place',
//         description: 'This is a sample place description.',
//         price: '100',
//         location: 'Sample Location'
//     })

//     await place.save()
//         .then(() => {
//             console.log('Place saved');
//             res.send('Place saved');
//         })
//         .catch((err) => {
//             console.log('Error saving place:', err);
//             res.status(500).send('Error saving place');
//         });
// })

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});