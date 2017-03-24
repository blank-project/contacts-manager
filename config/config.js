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
      url : 'mongodb://localhost:27017/contacts-manager-development',
      poolSize : 10
    }
  },

  test: {
    root: rootPath,
    app: {
      name: 'contacts-manager'
    },
    port: process.env.PORT || 3000,
    db : {
      url : 'mongodb://localhost:27017/contacts-manager-test',
      poolSize : 10
    }
  },

  production: {
    root: rootPath,
    app: {
      name: 'contacts-manager'
    },
    port: process.env.PORT || 3000,
    db : {
      url : 'mongodb://localhost:27017/contacts-manager-production',
      poolSize : 10
    }
  }
};

module.exports = config[env];
