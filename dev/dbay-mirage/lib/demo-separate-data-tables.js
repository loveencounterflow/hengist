(function() {
  'use strict';
  var CND, FS, GUY, H, PATH, SQL, badge, debug, echo, equals, freeze, help, info, isa, lets, normalize_tokens, rpr, to_width, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  GUY = require('../../../apps/guy');

  // { HDML }                  = require '../../../apps/hdml'
  H = require('../../../lib/helpers');

  ({lets, freeze} = GUY.lft);

  ({to_width} = require('to-width'));

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.demo_datamill = function(cfg) {
    var DBay, Mrg, db, dsk, mrg, oln, path, ref, txt, x;
    ({DBay} = require('../../../apps/dbay'));
    ({Mrg} = require('../../../apps/dbay-mirage'));
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
    db(mrg.sql.insert_trk_line, {
      dsk,
      oln: 2,
      trk: 2,
      pce: 1,
      txt: `something`
    });
    mrg.deactivate({
      dsk,
      oln: 2,
      trk: 2
    });
    db(mrg.sql.insert_trk_line, {
      dsk,
      oln: 2,
      trk: 3,
      pce: 1,
      txt: `<div>`
    });
    db(mrg.sql.insert_trk_line, {
      dsk,
      oln: 2,
      trk: 3,
      pce: 2,
      txt: `inserted content`
    });
    db(mrg.sql.insert_trk_line, {
      dsk,
      oln: 2,
      trk: 3,
      pce: 3,
      txt: `</div>`
    });
    //.........................................................................................................
    db.setv('dsk', dsk);
    H.tabulate('mrg_datasources', db(SQL`select * from mrg_datasources;`));
    H.tabulate('mrg_mirror', db(SQL`select * from mrg_mirror order by dsk, oln, trk, pce;`));
    H.tabulate('mrg_lines', db(SQL`select * from mrg_lines  order by dsk, oln;`));
    H.banner(`lines of ${dsk}`);
    ref = mrg.walk_line_rows({dsk});
    for (x of ref) {
      ({oln, txt} = x);
      urge('^474^', oln, rpr(txt));
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_paragraphs_etc = function(cfg) {
    var DBay, Mrg, db, dsk, mrg, path, prefix;
    ({DBay} = require('../../../apps/dbay'));
    ({Mrg} = require('../../../apps/dbay-mirage'));
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
    db(mrg.sql.insert_trk_line, {
      dsk,
      oln: 2,
      trk: 2,
      pce: 1,
      txt: `something`
    });
    mrg.deactivate({
      dsk,
      oln: 2,
      trk: 2
    });
    db(mrg.sql.insert_trk_line, {
      dsk,
      oln: 2,
      trk: 3,
      pce: 1,
      txt: `<div>`
    });
    db(mrg.sql.insert_trk_line, {
      dsk,
      oln: 2,
      trk: 3,
      pce: 2,
      txt: `inserted content`
    });
    db(mrg.sql.insert_trk_line, {
      dsk,
      oln: 2,
      trk: 3,
      pce: 3,
      txt: `</div>`
    });
    try {
      db.setv('allow_change_on_mirror', 1);
    } finally {
      // mrg.deactivate { dsk, oln: 10, trk: 1, }
      db.setv('allow_change_on_mirror', 0);
    }
    db(mrg.sql.insert_trk_line, {
      dsk,
      oln: 11,
      trk: 2,
      pce: 1,
      txt: ''
    });
    db(mrg.sql.insert_trk_line, {
      dsk,
      oln: 11,
      trk: 2,
      pce: 2,
      txt: `generated paragraph`
    });
    db(mrg.sql.insert_trk_line, {
      dsk,
      oln: 11,
      trk: 2,
      pce: 3,
      txt: ''
    });
    //.........................................................................................................
    H.tabulate(`${prefix}_mirror`, db(SQL`select * from ${prefix}_mirror           order by dsk, oln, trk, pce;`));
    // H.tabulate "#{prefix}_mirror (act)",  db SQL"select * from #{prefix}_mirror where act order by dsk, oln, trk, pce;"
    H.tabulate(`${prefix}_rwnmirror`, db(SQL`select * from ${prefix}_rwnmirror;`));
    H.tabulate(`${prefix}_parlnrs0`, db(SQL`select * from ${prefix}_parlnrs0;`));
    H.tabulate(`${prefix}_parlnrs`, db(SQL`select * from ${prefix}_parlnrs;`));
    H.tabulate(`${prefix}_parmirror`, db(SQL`select * from ${prefix}_parmirror;`));
    // H.tabulate "#{prefix}_datasources",   db SQL"select * from #{prefix}_datasources;"
    // H.tabulate "mrg.walk_line_rows()",  mrg.walk_line_rows { dsk, }
    H.tabulate("mrg.walk_par_rows()", mrg.walk_par_rows({dsk}));
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  normalize_tokens = function(tokens) {
    var R, d, i, j, key, keys, len, len1, ref, token;
    keys = [
      '$vnr',
      '$key',
      'type',
      'prefix',
      'name',
      'id',
      'class',
      'atrs',
      'start',
      'stop',
      'text',
      '$',
      'code'/* { $key: '^error', } */
      ,
      // 'chvtname'  ### { $key: '^error', } ###
      // 'origin'    ### { $key: '^error', } ###
      'message'/* { $key: '^error', } */
      
    ];
    R = [];
    for (i = 0, len = tokens.length; i < len; i++) {
      token = tokens[i];
      d = {};
      for (j = 0, len1 = keys.length; j < len1; j++) {
        key = keys[j];
        d[key] = (ref = token[key]) != null ? ref : null;
      }
      if (d.message != null) {
        // d.$key    = ( CND.reverse CND.red d.$key ) if d.$key is '^error'
        d.message = to_width(d.message, 20);
      }
      R.push(d);
    }
    return freeze(R);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_html_parsing = function(cfg) {
    var DBay, Mrg, db, dsk, mrg, path, prefix;
    ({DBay} = require('../../../apps/dbay'));
    ({Mrg} = require('../../../apps/dbay-mirage'));
    prefix = 'mrg';
    db = new DBay({
      path: '/dev/shm/demo-html-parsing.sqlite',
      recreate: true
    });
    mrg = new Mrg({db, prefix});
    db.create_stdlib();
    // dsk       = 'demo'
    // mrg.register_dsk { dsk, url: 'live:', }
    // dsk       = 'twcm'; path = 'dbay-rustybuzz/htmlish-tags.html'
    dsk = 'ne';
    path = 'dbay-rustybuzz/no-errors.html';
    path = PATH.resolve(PATH.join(__dirname, '../../../assets', path));
    mrg.register_dsk({dsk, path});
    mrg.refresh_datasource({dsk});
    // mrg.html.statements.insert_datasource.run { dsk, url: 'ram:', digest: null, }
    // mrg.html._append_tag dsk, '^', 'path', { id: 'c1', d: 'M100,100L200,200', }
    // mrg.html._append_tag dsk, '<', 'div', { id: 'c1', class: 'foo bar', }
    // mrg.html._append_tag dsk, '^', '$text', null, "helo"
    // mrg.html._append_tag dsk, '>', 'div'
    // mrg.html._append_tag dsk, '^', 'mrg:loc#baselines'
    mrg.html.parse_dsk({dsk});
    //.........................................................................................................
    db.setv('dsk', dsk);
    // # H.tabulate "#{prefix}_datasources",         db SQL"select * from #{prefix}_datasources;"
    H.tabulate(`${prefix}_html_mirror`, db(SQL`select * from ${prefix}_html_mirror;`));
    H.tabulate(`${prefix}_html_atrs`, db(SQL`select * from ${prefix}_html_atrs;`));
    // H.tabulate "std_variables()",               db SQL"select * from std_variables();"
    H.tabulate(`${prefix}_html_tags_and_html`, db(SQL`select * from ${prefix}_html_tags_and_html;`));
    H.tabulate(`${prefix}_parmirror`, db(SQL`select * from ${prefix}_parmirror;`));
    H.tabulate(`${prefix}_mirror`, db(SQL`select * from ${prefix}_mirror;`));
    // H.banner "render_dsk";                      echo mrg.html.render_dsk { dsk, }
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // @demo_html_generation()
      // @demo_datamill()
      // @demo_paragraphs_etc()
      return this.demo_html_parsing();
    })();
  }

}).call(this);

//# sourceMappingURL=demo-separate-data-tables.js.map