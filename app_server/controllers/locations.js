const request = require('request');

/* =========================================
   RENDER HOMEPAGE
========================================= */
const renderHomepage = function (req, res, locations, message, search) {
  res.render('locations-list', {
    title: 'Loc8r - encuentra sitios con wifi',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Encuentra sitios para trabajar con wifi cerca de ti'
    },
    locations: locations,
    message: message,
    search: search || ''
  });
};

/* =========================================
   HOME LIST
========================================= */
const homelist = function (req, res) {
  const path = '/api/locations';

  const lng = parseFloat(req.query.lng);
  const lat = parseFloat(req.query.lat);
  const search = req.query.search ? req.query.search.trim() : '';

  const requestOptions = {
    url: 'http://localhost:3000' + path,
    method: 'GET',
    json: {}
  };

  // 🔍 BÚSQUEDA POR TEXTO
  if (search) {
    requestOptions.qs = { search };
  }
  // 📍 BÚSQUEDA POR GEOLOCALIZACIÓN
  else if (!isNaN(lng) && !isNaN(lat)) {
    requestOptions.qs = {
      lng,
      lat,
      maxDistance: 20000
    };
  }
  // 📌 DEFAULT
  else {
    requestOptions.qs = {
      lng: -0.9690884,
      lat: 37.2565257,
      maxDistance: 20000
    };
  }

  request(requestOptions, function (err, response, body) {
    let locations = [];
    let message = null;

    if (!err && response.statusCode === 200) {
      locations = body;

      if (!locations.length) {
        message = 'No se encontraron resultados.';
      }
    } else {
      message = 'Ocurrió un error al buscar lugares.';
    }

    renderHomepage(req, res, locations, message, search);
  });
};

/* =========================================
   LOCATION INFO
========================================= */
const locationInfo = function (req, res) {
  const path = '/api/locations/' + req.params.locationid;

  const requestOptions = {
    url: 'http://localhost:3000' + path,
    method: 'GET',
    json: {}
  };

  request(requestOptions, function (err, response, body) {
    if (!err && response.statusCode === 200) {
      res.render('location-info', {
        title: body.name,
        location: body
      });
    } else {
      res.render('error', {
        message: 'No se pudo cargar la localización'
      });
    }
  });
};

/* =========================================
   ADD REVIEW FORM
========================================= */
const addReview = function (req, res) {
  const path = '/api/locations/' + req.params.locationid;

  const requestOptions = {
    url: 'http://localhost:3000' + path,
    method: 'GET',
    json: {}
  };

  request(requestOptions, function (err, response, body) {
    if (!err && response.statusCode === 200) {
      res.render('location-review-form', {
        title: 'Añadir reseña a ' + body.name,
        locationid: req.params.locationid,
        error: req.query.err || null
      });
    } else {
      res.render('error', {
        message: 'No se pudo cargar el formulario'
      });
    }
  });
};

/* =========================================
   DO ADD REVIEW
========================================= */
const doAddReview = function (req, res) {
  const locationid = req.params.locationid;
  const path = '/api/locations/' + locationid + '/reviews';

  const postdata = {
    author: req.body.name,
    rating: parseInt(req.body.rating, 10),
    reviewText: req.body.review
  };

  if (!postdata.author || !postdata.rating || !postdata.reviewText) {
    return res.redirect('/location/' + locationid + '/review/new?err=val');
  }

  const requestOptions = {
    url: 'http://localhost:3000' + path,
    method: 'POST',
    json: postdata
  };

  request(requestOptions, function (err, response, body) {
    if (!err && response.statusCode === 201) {
      res.redirect('/location/' + locationid);
    } else {
      res.redirect('/location/' + locationid + '/review/new?err=val');
    }
  });
};

/* =========================================
   ABOUT
========================================= */
const about = function (req, res) {
  res.render('generic-text', {
    title: 'Acerca de Loc8r',
    content:
      'Loc8r es una aplicación desarrollada en Tecnologías Web. Autor: Marta Borrego Padilla'
  });
};

/* =========================================
   EXPORTS
========================================= */
module.exports = {
  homelist,
  locationInfo,
  addReview,
  doAddReview,
  about
};