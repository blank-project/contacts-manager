var express = require('express')
  , router = express.Router()
  , ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
  , ensureRequest = require('../../config/authorization').ensureRequest
  , upload = require('multer')({ dest: 'data/uploads/' })
  , conf = require('../../config/config')
  , path = require('path')
  , db = conf.db
  , cwd = conf.root
  , execFile = require('child_process').execFile
  , scriptDir = path.join(cwd, 'scripts/')
  , script = path.join(scriptDir, 'contacts-import.sh');

// Exports a function to bind Controller
module.exports = function (app) {
  app.use('/import', ensureLoggedIn('/login'), ensureRequest.isPermitted('contact:import'), router);
};
router.get('/', function (req, res, next) {
    res.renderVue('import/contactImport', { title : 'Import de contact' });
});

router.post('/', upload.single('upload'), function (req, res, next) {
    if (!req.file) {
        res.renderVue('import/contactImport', { title : 'Import de contact', message : 'Fichier manquant' });
        return;
    }
    var filename = path.join(cwd, req.file.path)
      , options = {
      cwd : scriptDir,
      env : db
    };
    execFile(script, [ filename ], options, (error, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);

      if (error) {
        next(error);
        return;
      }

      res.redirect("/contacts");
    });
});
