var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'contacts-manager'
    },
    port: process.env.PORT || 3000,
    db : {
      database : 'contacts-manager-development',
      host : 'localhost',
      port : '27017',
      options : {
        poolSize : 10
      }

    }
  },

  test: {
    root: rootPath,
    app: {
      name: 'contacts-manager'
    },
    port: process.env.PORT || 3000,
    db : {
      database : 'contacts-manager-test',
      host : 'localhost',
      port : '27017',
      options : {
        poolSize : 10
      }
    }
  },

  production: {
    root: rootPath,
    app: {
      name: 'contacts-manager'
    },
    port: process.env.PORT || 3000,
    db : {
      database : 'contacts-manager-production',
      host : 'localhost',
      port : '27017',
      options : {
        poolSize : 10
      }

    }
  }
};

module.exports = config[env];
