const mongoose = require('mongoose');
const Location = mongoose.model('Location');

/* =========================================================
   UTILIDADES
========================================================= */

const sendJsonResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/* =========================================================
   LOCATIONS
========================================================= */

// GET /api/locations?lng=...&lat=...
const locationsListByDistance = async (req, res) => {
  const lng = parseFloat(req.query.lng);
  const lat = parseFloat(req.query.lat);
  const search = req.query.search ? req.query.search.trim() : '';

  try {
    // BÚSQUEDA POR TEXTO
    if (search) {
      const locations = await Location.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } }
        ]
      })
        .limit(10)
        .exec();

      const results = locations.map((doc) => ({
          _id: doc._id,
          name: doc.name,
          address: doc.address,
           rating: doc.rating,
           facilities: doc.facilities,
            distance: null,
          coords: doc.coords
      }));

      return sendJsonResponse(res, 200, results);
    }

    // BÚSQUEDA POR DISTANCIA
    if (isNaN(lng) || isNaN(lat)) {
      return sendJsonResponse(res, 400, {
        message: 'lng y lat son obligatorios o usa search'
      });
    }

    const locations = await Location.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          key: 'coords',
          spherical: true,
          distanceField: 'distance',
          maxDistance: 20000
        }
      },
      { $limit: 10 }
    ]);

    const results = locations.map((doc) => ({
      _id: doc._id,
      name: doc.name,
      address: doc.address,
      rating: doc.rating,
      facilities: doc.facilities,
      distance: Math.round(doc.distance),
      coords: doc.coords
    }));

    return sendJsonResponse(res, 200, results);
  } catch (err) {
    return sendJsonResponse(res, 500, {
      message: 'Error buscando localizaciones',
      error: err.message
    });
  }
};
// GET /api/locations/:locationid
const locationsReadOne = async (req, res) => {
  const { locationid } = req.params;

  if (!locationid) {
    return sendJsonResponse(res, 404, {
      message: 'No locationid in request'
    });
  }

  if (!isValidObjectId(locationid)) {
    return sendJsonResponse(res, 400, {
      message: 'Invalid locationid'
    });
  }

  try {
    const location = await Location.findById(locationid).exec();

    if (!location) {
      return sendJsonResponse(res, 404, {
        message: 'Location not found'
      });
    }

    return sendJsonResponse(res, 200, location);
  } catch (err) {
    return sendJsonResponse(res, 400, {
      message: 'Error leyendo localización',
      error: err.message
    });
  }
};

// POST /api/locations
const locationsCreate = async (req, res) => {
  try {
    const lng = parseFloat(req.body.lng);
    const lat = parseFloat(req.body.lat);

    const location = await Location.create({
      name: req.body.name,
      address: req.body.address,
      rating: req.body.rating || 0,
      facilities: req.body.facilities || [],
      coords: {
        type: 'Point',
        coordinates: [
          isNaN(lng) ? 0 : lng,
          isNaN(lat) ? 0 : lat
        ]
      },
      openingTimes: req.body.openingTimes || [],
      reviews: req.body.reviews || []
    });

    return sendJsonResponse(res, 201, location);
  } catch (err) {
    return sendJsonResponse(res, 400, {
      message: 'Error creando localización',
      error: err.message
    });
  }
};

// PUT /api/locations/:locationid
const locationsUpdateOne = async (req, res) => {
  const { locationid } = req.params;

  if (!locationid) {
    return sendJsonResponse(res, 404, {
      message: 'No locationid in request'
    });
  }

  if (!isValidObjectId(locationid)) {
    return sendJsonResponse(res, 400, {
      message: 'Invalid locationid'
    });
  }

  try {
    const location = await Location.findById(locationid).exec();

    if (!location) {
      return sendJsonResponse(res, 404, {
        message: 'Location not found'
      });
    }

    location.name = req.body.name ?? location.name;
    location.address = req.body.address ?? location.address;
    location.rating = req.body.rating ?? location.rating;
    location.facilities = req.body.facilities ?? location.facilities;

    if (req.body.lng !== undefined && req.body.lat !== undefined) {
      const lng = parseFloat(req.body.lng);
      const lat = parseFloat(req.body.lat);

      if (!isNaN(lng) && !isNaN(lat)) {
        location.coords = {
          type: 'Point',
          coordinates: [lng, lat]
        };
      }
    }

    if (req.body.openingTimes !== undefined) {
      location.openingTimes = req.body.openingTimes;
    }

    const updatedLocation = await location.save();
    return sendJsonResponse(res, 200, updatedLocation);
  } catch (err) {
    return sendJsonResponse(res, 400, {
      message: 'Error actualizando localización',
      error: err.message
    });
  }
};

// DELETE /api/locations/:locationid
const locationsDeleteOne = async (req, res) => {
  const { locationid } = req.params;

  if (!locationid) {
    return sendJsonResponse(res, 404, {
      message: 'No locationid in request'
    });
  }

  if (!isValidObjectId(locationid)) {
    return sendJsonResponse(res, 400, {
      message: 'Invalid locationid'
    });
  }

  try {
    const deletedLocation = await Location.findByIdAndDelete(locationid).exec();

    if (!deletedLocation) {
      return sendJsonResponse(res, 404, {
        message: 'Location not found'
      });
    }

    return sendJsonResponse(res, 204, null);
  } catch (err) {
    return sendJsonResponse(res, 400, {
      message: 'Error eliminando localización',
      error: err.message
    });
  }
};

/* =========================================================
   REVIEWS
========================================================= */

const doSetAverageRating = async (locationid) => {
  if (!isValidObjectId(locationid)) return;

  try {
    const location = await Location.findById(locationid)
      .select('rating reviews')
      .exec();

    if (!location || !location.reviews || location.reviews.length === 0) {
      if (location) {
        location.rating = 0;
        await location.save();
      }
      return;
    }

    const reviewCount = location.reviews.length;
    const ratingTotal = location.reviews.reduce((acc, review) => {
      return acc + (review.rating || 0);
    }, 0);

    location.rating = Math.round(ratingTotal / reviewCount);
    await location.save();
  } catch (err) {
    console.error(err);
  }
};

// POST /api/locations/:locationid/reviews
const reviewsCreate = async (req, res) => {
  const { locationid } = req.params;

  if (!locationid) {
    return sendJsonResponse(res, 404, {
      message: 'No locationid in request'
    });
  }

  if (!isValidObjectId(locationid)) {
    return sendJsonResponse(res, 400, {
      message: 'Invalid locationid'
    });
  }

  if (!req.body.author || !req.body.rating || !req.body.reviewText) {
    return sendJsonResponse(res, 400, {
      message: 'All fields required: author, rating, reviewText'
    });
  }

  try {
    const location = await Location.findById(locationid)
      .select('reviews')
      .exec();

    if (!location) {
      return sendJsonResponse(res, 404, {
        message: 'Location not found'
      });
    }

    location.reviews.push({
      author: req.body.author,
      rating: parseInt(req.body.rating, 10),
      reviewText: req.body.reviewText,
      createdOn: new Date()
    });

    await location.save();
    await doSetAverageRating(locationid);

    const newReview = location.reviews[location.reviews.length - 1];
    return sendJsonResponse(res, 201, newReview);
  } catch (err) {
    return sendJsonResponse(res, 400, {
      message: 'Error creando review',
      error: err.message
    });
  }
};

// GET /api/locations/:locationid/reviews/:reviewid
const reviewsReadOne = async (req, res) => {
  const { locationid, reviewid } = req.params;

  if (!locationid || !reviewid) {
    return sendJsonResponse(res, 404, {
      message: 'Not found, locationid and reviewid are both required'
    });
  }

  if (!isValidObjectId(locationid) || !isValidObjectId(reviewid)) {
    return sendJsonResponse(res, 400, {
      message: 'Invalid locationid or reviewid'
    });
  }

  try {
    const location = await Location.findById(locationid)
      .select('name reviews')
      .exec();

    if (!location) {
      return sendJsonResponse(res, 404, {
        message: 'Location not found'
      });
    }

    const review = location.reviews.id(reviewid);

    if (!review) {
      return sendJsonResponse(res, 404, {
        message: 'Review not found'
      });
    }

    return sendJsonResponse(res, 200, {
      location: {
        name: location.name,
        id: location._id
      },
      review
    });
  } catch (err) {
    return sendJsonResponse(res, 400, {
      message: 'Error leyendo review',
      error: err.message
    });
  }
};

// DELETE /api/locations/:locationid/reviews/:reviewid
const reviewsDeleteOne = async (req, res) => {
  const { locationid, reviewid } = req.params;

  if (!locationid || !reviewid) {
    return sendJsonResponse(res, 404, {
      message: 'Not found, locationid and reviewid are both required'
    });
  }

  if (!isValidObjectId(locationid) || !isValidObjectId(reviewid)) {
    return sendJsonResponse(res, 400, {
      message: 'Invalid locationid or reviewid'
    });
  }

  try {
    const location = await Location.findById(locationid)
      .select('reviews')
      .exec();

    if (!location) {
      return sendJsonResponse(res, 404, {
        message: 'Location not found'
      });
    }

    const review = location.reviews.id(reviewid);

    if (!review) {
      return sendJsonResponse(res, 404, {
        message: 'Review not found'
      });
    }

    review.deleteOne();
    await location.save();
    await doSetAverageRating(locationid);

    return sendJsonResponse(res, 204, null);
  } catch (err) {
    return sendJsonResponse(res, 400, {
      message: 'Error eliminando review',
      error: err.message
    });
  }
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  locationsListByDistance,
  locationsReadOne,
  locationsCreate,
  locationsUpdateOne,
  locationsDeleteOne,
  reviewsCreate,
  reviewsReadOne,
  reviewsDeleteOne
};