// MODULES
const path = require('path')
 , execFile = require('child_process').execFile
 , uuid = require('uuid/v1')
 , fs = require('fs')
 , unlink = require('util').promisify(fs.unlink)
 , EJSON = require('mongodb-extended-json')
 , ObjectID = require('mongodb').ObjectID;

// Export part
const CONF = require('../../config/config')
, CWD = CONF.root
, SCRIPTS_DIR = path.join(CWD, 'scripts/')
, SCRIPT = path.join(SCRIPTS_DIR, 'contacts-export.sh')
, EXPORTS_DIR = path.join(CWD, 'data', 'downloads/');

const ContactManager = new (require('../business/ContactManager'))();

module.exports = class ExportManager {

  /**
   * Parameter constructor.
   * @param {String} [dir] the absolute filepath to the export directory.
   */
  constructor(dir) {
    if (!dir) {
      this._directory = EXPORTS_DIR;
      return;
    }
    if (!dir.endsWith(path.sep)) {
      dir += path.sep;
    }
    dir = path.normalize(dir);
    if (!path.isAbsolute(dir)) {
      dir = path.join(CWD, dir);
    }
    this._directory = dir;
  }

  /**
   * Generates a unique absolute filename for the Export.
   */
  generateFileName() {
    return path.join(this._directory, uuid());
  }

  /**
   * Generate the process Options.
   */
  getProcessOptions() {
    var opts =  {
      cwd : SCRIPTS_DIR,
      env : { }
    };
    Object.assign(opts.env, CONF.exportDbEnv());    
    return opts;
  }

  /**
   * Translates a query to MongoDB Extended JSON format, for mongoexport.
   */
  getMongoQuery(query) {
    return EJSON.stringify(ContactManager.buildQuery(query));
  }

  generateExport(pQuery) {
    const options = this.getProcessOptions();
    const filename = this.generateFileName();
    const query = this.getMongoQuery(pQuery);

    return new Promise(function(resolve, reject) {
      execFile(SCRIPT, [ filename, query ], options, (err, stdout, stderr) => {
        if (err) {
          console.log(stdout);
          console.log(stderr);
          reject(err);
          return;
        }

        resolve({
          path : filename,
          remove : function() {
            return unlink(filename);
          }
        });
      });
    });
  }
}
