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
   * @param {Object} userData the user data :
   * @param {String} userData.username
   * @param {String} userData.password
   * @param {String} userData.firstname
   * @param {String} userData.lastname
   * @param {String} [userData.email]
   * @param {String} [userData.phone]
   * @param {String} [userData.organization]
   * @param {String} [userData.title]
   * @param {User} [principal] the authenticated user performing the request.
   * @return a promise resolving to the user.
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

  /**
   * Updates a User.
   * @param {User} user the user to update
   * @param {Object} userData the user data to update, will be sanitized :
   * @param {String} [userData.firstname]
   * @param {String} [userData.lastname]
   * @param {String} [userData.email]
   * @param {String} [userData.phone]
   * @param {String} [userData.organization]
   * @param {String} [userData.title]
   * @return {Promise} a promise resolving to the updated user.
   */
  update(user, userData) {
    const data = sanitize(userData);
    user.set(data);
    return user.save();
  }

  /**
   * Updates a User's password.
   * @param {User} user the user to update
   * @param {String} oldPwd the old password
   * @param {String} newPwd the new password
   * @return {Promise} a promise resolving to true if password match, false otherwise.
   */
  updatePassword(user, oldPwd, newPwd) {
    return new Promise(function(resolve, reject){
      user.changePassword(oldPwd, newPwd, function(err) {
          resolve(!err);
      });
    });
  }

};
