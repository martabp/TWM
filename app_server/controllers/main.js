const index = function(req, res){
  res.render('index', { title: 'Express' });
};

const about = function(req, res){
  res.render('about', { title: 'About' });
};

const about = function (req, res) {
  res.render('generic-text', {
    title: 'Acerca de Loc8r',
    content: 'Loc8r te ayuda a encontrar lugares con wifi cerca de ti para trabajar, estudiar o relajarte.'
  });
};

module.exports = {
  homelist,
  locationInfo,
  addReview,
  about
};


