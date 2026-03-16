const express = require('express');
const router = express.Router();

const ctrlMain = require('../controllers/main');

router.get('/', ctrlMain.index);

module.exports = router;
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About' });
});