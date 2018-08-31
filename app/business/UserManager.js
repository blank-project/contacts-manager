var User = require('../models/User')
, ObjectID = require('mongodb').ObjectID;

function sanitize(userData) {
  return {
    name : {
      first : userData.firstname,
      last : userData.lastname
    },
    email : userData.email,
    phone : userData.phone,
    organization : userData.organization,
    title : userData.title
  };
}

module.exports = class UserManager {

  /**
   * @param userData the user data
   * @param [principal] the authenticated user performing the request.
   * @return a promise resolved to the user.
   */
  create(userData, principal) {
    var data, user;
    data = sanitize(userData);
    data.username = userData.username;
    user =  new User(data);

    user.ban(!principal || !principal.isPermitted('user:create'));

    return new Promise(function(resolve, reject) {
      User.register(user, userData.password, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  }

  update(userData) {
    var data, user;
    data = sanitize(userData);
    data.username = userData.username;
    user =  new User(data);

    if (!principal || !principal.isPermitted('user:create')) {
      this.ban(user);
    }
    return new Promise(function(resolve, reject) {
      User.register(user, userData.password, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  }

  updatePassword() {

  }

};
