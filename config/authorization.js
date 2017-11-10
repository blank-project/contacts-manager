var authorization = require('express-authorization');
module.exports = { authorization : authorization };
module.exports.ensureRequest = authorization.ensureRequest
  .withPermissions(function (req, res, done) {
      console.log(req.user.permissions);
      done(req.user.permissions);
  })
  .onDenied(function(req, res, done) {
      console.log('DENIED');
      res.sendStatus(403);
  });

module.exports.helpers = {};
module.exports.helpers.isPermitted = function(...params) {
  var roles = params.slice(0, params.length - 1),
  options = params[params.length - 1],
  user = options.data.root.user;
  if (authorization.considerSubject(user).isPermitted(roles)) {
      return options.fn(this);
  } else {
    return options.inverse(this);
  }
}
