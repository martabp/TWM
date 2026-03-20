const homelist = function (req, res) {
  res.render('locations-list', {
    title: 'Loc8r - find a place to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find places to work with wifi near you!'
    },
    sidebar: 'Looking for wifi and a seat? Loc8r helps you find places to work when out and about.'
  });
};

const locationInfo = function (req, res) {
  res.render('location-info', {
    title: 'Starcups'
  });
};

const addReview = function (req, res) {
  res.render('location-review-form', {
    title: 'Add review'
  });
};

const about = function (req, res) {
  res.render('generic-text', {
    title: 'About Loc8r',
    content: 'Loc8r helps people find places to work, eat or have a coffee with wifi.'
  });
};

module.exports = {
  homelist,
  locationInfo,
  addReview,
  about
};