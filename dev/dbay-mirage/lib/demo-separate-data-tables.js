(function() {
  'use strict';
  var CND, FS, H, PATH, SQL, badge, debug, echo, equals, guy, help, info, isa, normalize_tokens, rpr, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-MIRAGE/DEMO';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  PATH = require('path');

  FS = require('fs');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  // { HDML }                  = require '../../../apps/hdml'
  H = require('../../../lib/helpers');

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.demo_datamill = function(cfg) {
    var DBay, Mrg, db, dsk, lnr, mrg, path, ref, txt, x;
    ({DBay} = require('../../../apps/dbay'));
    ({Mrg} = require('../../../apps/dbay-mirage/lib/main2'));
    db = new DBay();
    mrg = new Mrg({db});
    db.create_stdlib();
    dsk = 'twcm';
    path = 'dbay-rustybuzz/template-with-content-markers.html';
    path = PATH.resolve(PATH.join(__dirname, '../../../assets', path));
    //.........................................................................................................
    mrg.register_dsk({dsk, path});
    mrg.refresh_datasource({dsk});
    db.setv('allow_change_on_mirror', 1);
    db(mrg.sql.insert_lnpart, {
      dsk,
      lnr: 2,
      trk: 2,
      pce: 1,
      txt: `something`
    });
    mrg.deactivate({
      dsk,
      lnr: 2,
      trk: 2
    });
    db(mrg.sql.insert_lnpart, {
      dsk,
      lnr: 2,
      trk: 3,
      pce: 1,
      txt: `<div>`
    });
    db(mrg.sql.insert_lnpart, {
      dsk,
      lnr: 2,
      trk: 3,
      pce: 2,
      txt: `inserted content`
    });
    db(mrg.sql.insert_lnpart, {
      dsk,
      lnr: 2,
      trk: 3,
      pce: 3,
      txt: `</div>`
    });
    //.........................................................................................................
    db.setv('dsk', dsk);
    H.tabulate('mrg_datasources', db(SQL`select * from mrg_datasources;`));
    H.tabulate('mrg_mirror', db(SQL`select * from mrg_mirror order by dsk, lnr, trk, pce;`));
    H.tabulate('mrg_lines', db(SQL`select * from mrg_lines  order by dsk, lnr;`));
    H.banner(`lines of ${dsk}`);
    ref = mrg.walk_line_rows({dsk});
    for (x of ref) {
      ({lnr, txt} = x);
      urge('^474^', lnr, rpr(txt));
    }
    return null;
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.demo_htmlish = function(cfg) {
    var DBay, HTML, Mrg, db, dsk, lnr, mrg, new_grammar, path, prefix, ref, txt, x;
    ({DBay} = require('../../../apps/dbay'));
    ({Mrg} = require('../../../apps/dbay-mirage/lib/main2'));
    ({new_grammar} = require('../../../apps/paragate/lib/htmlish.grammar'));
    HTML = new_grammar({
      bare: true
    });
    prefix = 'mrg';
    db = new DBay();
    mrg = new Mrg({db, prefix});
    db.create_stdlib();
    dsk = 'twcm';
    path = 'dbay-rustybuzz/htmlish-tags.html';
    path = PATH.resolve(PATH.join(__dirname, '../../../assets', path));
    mrg.register_dsk({dsk, path});
    mrg.refresh_datasource({dsk});
    //.........................................................................................................
    // db.setv 'allow_change_on_mirror', 1
    db(mrg.sql.insert_lnpart, {
      dsk,
      lnr: 2,
      trk: 2,
      pce: 1,
      txt: `something`
    });
    mrg.deactivate({
      dsk,
      lnr: 2,
      trk: 2
    });
    db(mrg.sql.insert_lnpart, {
      dsk,
      lnr: 2,
      trk: 3,
      pce: 1,
      txt: `<div>`
    });
    db(mrg.sql.insert_lnpart, {
      dsk,
      lnr: 2,
      trk: 3,
      pce: 2,
      txt: `inserted content`
    });
    db(mrg.sql.insert_lnpart, {
      dsk,
      lnr: 2,
      trk: 3,
      pce: 3,
      txt: `</div>`
    });
    //.........................................................................................................
    H.tabulate(`${prefix}_mirror`, db(SQL`select * from ${prefix}_mirror order by dsk, lnr, trk, pce;`));
    H.tabulate(`${prefix}_mirror`, db(SQL`select * from ${prefix}_paragraph_linenumbers;`));
    H.tabulate(`${prefix}_parmirror`, db(SQL`select * from ${prefix}_parmirror;`));
    H.tabulate(`${prefix}_lines`, mrg.walk_line_rows({dsk}));
    H.tabulate(`${prefix}_lines`, mrg.walk_par_rows({dsk}));
    return null;
    ref = mrg.walk_line_rows({dsk});
    //.........................................................................................................
    for (x of ref) {
      ({lnr, txt} = x);
      urge((HTML.parse(txt)).length);
      urge((normalize_tokens(HTML.parse(txt))).length);
      H.tabulate(`${lnr} ${rpr(txt)}`, normalize_tokens(HTML.parse(txt)));
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_rxws = function(cfg) {
    var DBay, Mrg, RXWS;
    ({DBay} = require('../../../apps/dbay'));
    ({Mrg} = require('../../../apps/dbay-mirage/lib/main2'));
    ({
      grammar: RXWS
    } = require('../../../apps/paragate/lib/regex-whitespace.grammar'));
    debug('^343545^', RXWS.parse(`first paragraph

second
paragraph

  indented`));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  normalize_tokens = function(tokens) {
    var R, d, i, j, key, keys, len, len1, ref, token;
    keys = ['$vnr', '$key', 'type', 'prefix', 'name', 'class', 'id', 'start', 'stop', 'text', '$'];
    R = [];
    for (i = 0, len = tokens.length; i < len; i++) {
      token = tokens[i];
      d = {};
      for (j = 0, len1 = keys.length; j < len1; j++) {
        key = keys[j];
        d[key] = (ref = token[key]) != null ? ref : null;
      }
      R.push(d);
    }
    return guy.lft.freeze(R);
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // @demo_html_generation()
      // @demo_datamill()
      return this.demo_htmlish();
    })();
  }

  // @demo_rxws()

}).call(this);

//# sourceMappingURL=demo-separate-data-tables.js.map