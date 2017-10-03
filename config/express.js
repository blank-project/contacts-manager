var express = require('express');
var glob = require('glob');

// var favicon = require('serve-favicon');
var logger = require('morgan');

// Parsers
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var compress = require('compression');
var methodOverride = require('method-override');
// Handlebars
var exphbs = require('express-handlebars');
var helpers = require('handlebars-helpers')(['collection', 'array']);
var session = require('express-session');

// Auth conf
var auth = require('./auth');

// Exports a configuration function.
module.exports = function(app, config) {
  var env = process.env.NODE_ENV || 'development';
  var secret = 'secretkey';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  // Register view engine (handlebars).
  app.engine('hbs', exphbs({
    layoutsDir: config.root + '/app/views/layouts/',
    defaultLayout: 'main',
    extname : '.hbs',
    partialsDir: [config.root + '/app/views/partials/'],
    helpers : helpers
  }));
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'hbs');

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser(secret));
  app.use(session({
    secret: secret,
    saveUninitialized : false,
    resave : false
  }));

  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

  app.use(auth.initialize());
  app.use(auth.session());

  // Register all controllers
  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app);
  });

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if (app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      console.log(err);
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  } else {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: {},
          title: 'Une erreur s\'est produite'
        });
    });
  }
  return app;
};
