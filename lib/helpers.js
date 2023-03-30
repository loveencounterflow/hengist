(function() {
  'use strict';
  var CND, PATH, assign, badge, debug, echo, help, info, jr, rpr, to_width, urge, warn, whisper, width_of;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'BENCHMARKS/HELPERS';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  ({jr, assign} = CND);

  //...........................................................................................................
  PATH = require('path');

  ({width_of, to_width} = require('to-width'));

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.cwd_abspath = CND.cwd_abspath;

  this.cwd_relpath = CND.cwd_relpath;

  this.here_abspath = CND.here_abspath;

  this._drop_extension = (path) => {
    return path.slice(0, path.length - (PATH.extname(path)).length);
  };

  this.project_abspath = (...P) => {
    return CND.here_abspath(__dirname, '..', ...P);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.badge_from_filename = function(filename) {
    var basename;
    basename = PATH.basename(filename);
    return 'BENCHMARKS/' + (basename.replace(/^(.*?)\.[^.]+$/, '$1')).toUpperCase();
  };

  //-----------------------------------------------------------------------------------------------------------
  this.banner = function(title) {
    echo(CND.reverse(CND.steel(to_width(' ' + title + ' ', 108))));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.tabulate = function(title, query) {
    var Tbl, dtab;
    ({Tbl} = require('../apps/icql-dba-tabulate'));
    dtab = new Tbl({
      dba: {}
    });
    if (title != null) {
      this.banner(title);
    }
    echo(dtab._tabulate(query));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.norm_tabulate = function(title, query) {
    /* same as `tabulate()` but works on a copy of `query` where all rows have same properties to avoid
     jumbling of column widths */
    var d, i, idx, j, k, key, keys, len, len1, len2, row, rows, value;
    rows = (function() {
      var results;
      results = [];
      for (row of query) {
        results.push({...row});
      }
      return results;
    })();
    keys = new Set();
    for (i = 0, len = rows.length; i < len; i++) {
      row = rows[i];
      for (key in row) {
        keys.add(key);
      }
    }
    keys = [...keys];
    for (idx = j = 0, len1 = rows.length; j < len1; idx = ++j) {
      row = rows[idx];
      d = {};
      for (k = 0, len2 = keys.length; k < len2; k++) {
        key = keys[k];
        d[key] = (value = row[key]) === void 0 ? void 0 : value;
      }
      rows[idx] = d;
    }
    return this.tabulate(title, rows);
  };

}).call(this);

//# sourceMappingURL=helpers.js.map