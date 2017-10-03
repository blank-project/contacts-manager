var express = require('express'),
  router = express.Router(),
  auth = require('../../config/auth');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
    res.render('home/index', {
      title : 'Contacts Manager'
    });
});

router.route('/login')
  .get(function (req, res, next) {
      res.render('home/login', {
        title : 'Contacts Manager - Login'
      });
  })
  .post(auth.authenticate('local', {
    successRedirect: '/contacts',
    failureRedirect: '/login'
  }));

router.get('/logout', function (req, res, next) {
    req.logout();
    res.render('home/index', {
      title : 'Contacts Manager - Logout'
    });
});

router.route('/signup')
  .get(function (req, res, next) {
      res.render('home/signup', {
        title : 'Contacts Manager - Sign Up'
      });
  })
