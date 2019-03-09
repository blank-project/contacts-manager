var path = require('path'),
    dotenv = require('dotenv'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

function loadDbConf(config) {
  var db = {};
  config.db = db;
  db.host = process.env.DB_HOST;
  db.database = process.env.DB_DATABASE;
  db.port = process.env.DB_PORT;
  db.user = process.env.DB_USER;
  db.password = process.env.DB_PASSWORD;
  db.opts = process.env.DB_OPTS;
}

// Env specific conf
var envs = {
  development: {
    env : ".env.dev"
  },

  test: {
    env : "test/.env.test"
  },

  production: {
    
  }

};

var config = {
  root: rootPath,
  app: {
    name: 'contacts-manager'
  },
  port: process.env.PORT || 3000
}

config = Object.assign(config, envs[env]);

// Load optional env file into process.env
if (config.env) {
  dotenv.config({ path: path.join(rootPath, config.env) });
}

loadDbConf(config);

config.exportDbEnv = function() {
  var env = {};
  env.DB_HOST = this.db.host;
  env.DB_DATABASE = this.db.database;
  env.DB_PORT = this.db.port;
  env.DB_USER = this.db.user;
  env.DB_PASSWORD = this.db.password;
  env.DB_OPTS = this.db.opts;
  return env;
};

module.exports = config;
