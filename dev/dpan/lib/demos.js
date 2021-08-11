(function() {
  'use strict';
  var CND, Dba, Dpan, FS, PATH, SQL, badge, debug, def, demo_custom_require, echo, freeze, glob, got, help, info, isa, lets, rpr, semver_cmp, semver_satisfies, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HENGIST/DEV/DPAN';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of} = types.export());

  // { to_width }              = require 'to-width'
  SQL = String.raw;

  ({lets, freeze} = require('letsfreezethat'));

  ({Dba} = require('icql-dba'));

  def = Object.defineProperty;

  glob = require('glob');

  PATH = require('path');

  FS = require('fs');

  got = require('got');

  semver_satisfies = require('semver/functions/satisfies');

  semver_cmp = require('semver/functions/cmp');

  ({Dpan} = require('../../../apps/dpan'));

  //-----------------------------------------------------------------------------------------------------------
  demo_custom_require = async function() {
    var RPKGUP, createRequire, dep_description, dep_fspath, dep_json, dep_json_fspath, dep_json_info, dep_keywords, dep_version, dpan, i, len, path, pkg_name, pkg_names_and_svranges, ref, rq, svrange;
    RPKGUP = (await import('read-pkg-up'));
    dpan = new Dpan();
    return;
    pkg_names_and_svranges = [['@ef-carbon/deep-freeze', '^1.0.1'], ['@scotttrinh/number-ranges', '^2.1.0'], ['argparse', '^2.0.1'], ['better-sqlite3', '7.4.0'], ['chance', '^1.1.7'], ['cnd', '^9.2.1']];
    path = '../../../lib/main.js';
    path = PATH.resolve(PATH.join(__dirname, path));
    ({createRequire} = require('module'));
    rq = createRequire(path);
    for (i = 0, len = pkg_names_and_svranges.length; i < len; i++) {
      [pkg_name, svrange] = pkg_names_and_svranges[i];
      dep_fspath = rq.resolve(pkg_name);
      dep_json_info = RPKGUP.readPackageUpSync({
        cwd: dep_fspath,
        normalize: true
      });
      dep_json = dep_json_info.packageJson;
      dep_version = dep_json.version;
      dep_description = dep_json.description;
      dep_keywords = (ref = dep_json.keywords) != null ? ref : [];
      dep_json_fspath = dep_json_info.path;
      info();
      info(CND.yellow(pkg_name));
      info(CND.blue(dep_fspath));
      info(CND.gold(dep_keywords));
      // info ( CND.lime dep_pkgj_fspath )
      info(dep_version);
      info(dep_description);
    }
    // info ( CND.lime FS.realpathSync dep_fspath )
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      // await demo()
      return (await demo_custom_require());
    })();
  }

  // CP = require 'child_process'
// debug '^33442^', CP.execSync "npm view icql-dba@^6 dependencies", { encoding: 'utf-8', }
// debug '^33442^', CP.execSync "npm view icql-dba dependencies", { encoding: 'utf-8', }

}).call(this);

//# sourceMappingURL=demos.js.map