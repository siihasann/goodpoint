const express = require('express');
const mongoose = require('mongoose');

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


app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

app.get('/places', async (req, res) => { 
    const places = await Place.find();
    res.render('places/index', { places });
})

// Test Send Data
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