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
var flash = require('connect-flash');
var expressVue = require('express-vue');

// Authentication conf
var authentication = require('./authentication');
// Authorization conf
var authorization = require('./authorization');

// Exports a configuration function.
module.exports = function(app, config) {
  var env = process.env.NODE_ENV || 'development';
  var secret = 'secretkey';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  helpers.isPermitted = authorization.helpers.isPermitted;

  const vueOptions = {
    rootPath: config.root + '/app/views/vue',
    vue: {
      head: {
        title: 'Contacts Manager',
        meta: [
        { script: 'https://code.jquery.com/jquery-3.2.1.min.js' },
        { script: 'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js' },
          { script: 'https://unpkg.com/vue' },
          { style: 'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css' },
          { style: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
          { style: '/css/style.css' }
        ]
      }
    },
  };

  const expressVueMiddleware = expressVue.init(vueOptions);
  app.use(expressVueMiddleware);

  // Register view engine (handlebars).
  app.engine('hbs', exphbs({
    layoutsDir: config.root + '/app/views/_layouts/',
    defaultLayout: 'main',
    extname : '.hbs',
    partialsDir: [config.root + '/app/views/_partials/'],
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

  app.use(flash());
  app.use(cookieParser(secret));
  app.use(session({
    secret: secret,
    saveUninitialized : false,
    resave : false
  }));

  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

  app.use(authentication.initialize());
  app.use(authentication.session());

  app.use(function(req, res, next) {
    // Expose req and user as response-local attribute
    res.locals.req = req;
    res.locals.user = req.user;
    next();
  });

  // Hack to always have access to data from res.locals in rendering data.
  // It is the default behavior, but it is not supported by express-vue.
  app.use(function(req, res, next) {
    var old = res.renderVue;

    // Override original version.
    res.renderVue = function(componentPath, data = {}, vueOptions = {}) {
      if (req.user && !data.user) {
        data.user = {
          permissions: req.user.permissions,
          username: req.user.username
        };
      }
      // Call original version.
      old(componentPath, data, vueOptions);
    };
    next();
  });

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
