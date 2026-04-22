const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

const data = [
  {
    name: 'Starcups',
    address: '125 High Street',
    rating: 3,
    facilities: ['Hot drinks', 'Food', 'Premium wifi'],
    reviews: []
  },
  {
    name: 'Cafe Central',
    address: '20 Main Street',
    rating: 4,
    facilities: ['Coffee', 'Snacks', 'Wifi'],
    reviews: []
  },
  {
    name: 'Burger House',
    address: '8 Market Square',
    rating: 5,
    facilities: ['Burgers', 'Drinks', 'Take away'],
    reviews: []
  }
];

async function seedDB() {
  try {
    const count = await Loc.countDocuments();

    if (count === 0) {
      await Loc.create(data);
      console.log('Datos insertados');
    } else {
      console.log('La base de datos ya tiene datos');
    }
  } catch (err) {
    console.log(err);
  }
}

seedDB();