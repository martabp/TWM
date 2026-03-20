const index = function(req, res){
  res.render('index', { title: 'Express' });
};

const about = function(req, res){
  res.render('about', { title: 'About' });
};

module.exports = {
  index,
  about
};