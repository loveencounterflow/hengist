(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, equals, guy, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-MIRAGE';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  // FS                        = require 'fs'
  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  //-----------------------------------------------------------------------------------------------------------
  this["location marker matching"] = async function(T, done) {
    var Mrg, error, i, len, matcher, probe, probes_and_matchers;
    // T?.halt_on_error()
    ({Mrg} = require('../../../apps/dbay-rustybuzz/lib/_mirage'));
    //.........................................................................................................
    probes_and_matchers = [
      [
        '<mrg:loc#first/>',
        [
          {
            id: 'first'
          }
        ],
        null
      ],
      [
        '<mrg:loc#foo-bar-123/>',
        [
          {
            id: 'foo-bar-123'
          }
        ],
        null
      ],
      ['<mrg:loc# foo-bar-123/>',
      [],
      null],
      ['<MRG:loc#foo-bar-123/>',
      [],
      null],
      ['<mrg:loc#first />',
      [],
      null],
      ['<mrg:loc id="first"/>',
      [],
      null],
      ['<mrg:loc#first>',
      [],
      null]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, result;
          result = (function() {
            var ref, results;
            ref = probe.matchAll(Mrg.C.defaults.constructor_cfg.loc_pattern);
            results = [];
            for (d of ref) {
              results.push({...d.groups});
            }
            return results;
          })();
          resolve(result);
          return null;
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["mrg.refresh_datasource"] = function(T, done) {
    var DBay, Mrg, db, dsk, mrg, path;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({Mrg} = require('../../../apps/dbay-rustybuzz/lib/_mirage'));
    // { Drb }   = require H.drb_path
    db = new DBay();
    mrg = new Mrg({db});
    dsk = 'sp';
    path = 'short-proposal.mkts.md';
    path = PATH.resolve(PATH.join(__dirname, '../../../assets', path));
    mrg.register_dsk({dsk, path});
    (() => {      //.........................................................................................................
      var result;
      result = mrg.refresh_datasource({dsk});
      debug('^44498^', result);
      return T != null ? T.eq(result, {
        files: 1,
        bytes: 384
      }) : void 0;
    })();
    (() => {      //.........................................................................................................
      var result;
      result = mrg.refresh_datasource({dsk});
      debug('^44498^', result);
      return T != null ? T.eq(result, {
        files: 0,
        bytes: 0
      }) : void 0;
    })();
    (() => {      //.........................................................................................................
      var result;
      mrg._update_digest(dsk, null);
      result = mrg.refresh_datasource({dsk});
      debug('^44498^', result);
      return T != null ? T.eq(result, {
        files: 1,
        bytes: 384
      }) : void 0;
    })();
    (() => {      //.........................................................................................................
      var result;
      result = mrg.refresh_datasource({
        dsk,
        force: true
      });
      debug('^44498^', result);
      return T != null ? T.eq(result, {
        files: 1,
        bytes: 384
      }) : void 0;
    })();
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["loc markers 1"] = function(T, done) {
    var DBay, Mrg, db, dsk, mrg, path;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({Mrg} = require('../../../apps/dbay-rustybuzz/lib/_mirage'));
    // { Drb }   = require H.drb_path
    db = new DBay();
    mrg = new Mrg({db});
    dsk = 'twcm';
    path = 'dbay-rustybuzz/template-with-content-markers.html';
    path = PATH.resolve(PATH.join(__dirname, '../../../assets', path));
    mrg.register_dsk({dsk, path});
    info('^33298-1^', mrg.refresh_datasource({dsk}));
    //.........................................................................................................
    console.table(db.all_rows(SQL`select * from mrg_mirror order by dsk, lnr, lnpart;`));
    console.table(db.all_rows(SQL`select * from mrg_locs   order by dsk, locid;`));
    if (T != null) {
      T.eq(db.all_rows(SQL`select * from mrg_mirror order by dsk, lnr, lnpart;`), [
        {
          dsk: 'twcm',
          lnr: 1,
          lnpart: 1,
          isloc: 0,
          line: '<title>'
        },
        {
          dsk: 'twcm',
          lnr: 1,
          lnpart: 2,
          isloc: 1,
          line: '<mrg:loc#title/>'
        },
        {
          dsk: 'twcm',
          lnr: 1,
          lnpart: 3,
          isloc: 0,
          line: '</title>'
        },
        {
          dsk: 'twcm',
          lnr: 2,
          lnpart: 1,
          isloc: 0,
          line: '<article>'
        },
        {
          dsk: 'twcm',
          lnr: 3,
          lnpart: 1,
          isloc: 0,
          line: '  <p>Here comes some '
        },
        {
          dsk: 'twcm',
          lnr: 3,
          lnpart: 2,
          isloc: 1,
          line: '<mrg:loc#content/>'
        },
        {
          dsk: 'twcm',
          lnr: 3,
          lnpart: 3,
          isloc: 0,
          line: '.</p>'
        },
        {
          dsk: 'twcm',
          lnr: 4,
          lnpart: 1,
          isloc: 0,
          line: '  </article>'
        },
        {
          dsk: 'twcm',
          lnr: 5,
          lnpart: 1,
          isloc: 0,
          line: ''
        }
      ]);
    }
    if (T != null) {
      T.eq(db.all_rows(SQL`select * from mrg_locs   order by dsk, locid;`), [
        {
          dsk: 'twcm',
          locid: 'content',
          lnr: 3,
          lnpart: 2
        },
        {
          dsk: 'twcm',
          locid: 'title',
          lnr: 1,
          lnpart: 2
        }
      ]);
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["loc markers 2"] = function(T, done) {
    var DBay, Mrg, db, dsk, mrg, path, ref, row;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({Mrg} = require('../../../apps/dbay-rustybuzz/lib/_mirage'));
    // { Drb }   = require H.drb_path
    db = new DBay();
    mrg = new Mrg({db});
    dsk = 'twcm';
    path = 'dbay-rustybuzz/template-with-content-markers.html';
    path = PATH.resolve(PATH.join(__dirname, '../../../assets', path));
    mrg.register_dsk({dsk, path});
    info('^33298-2^', mrg.refresh_datasource({dsk}));
    console.table(db.all_rows(SQL`select * from mrg_mirror order by dsk, lnr, lnpart;`));
    info('^33298-3^', mrg.append_to_loc({
      dsk,
      locid: 'title',
      text: "A Grand Union"
    }));
    // info '^33298-4^', mrg.prepend_to_loc { dsk, locid: 'content', text: "content goes here" }
    console.table(db.all_rows(SQL`select * from mrg_mirror order by dsk, lnr, lnpart;`));
    ref = mrg.walk_line_rows({dsk});
    //.........................................................................................................
    for (row of ref) {
      urge('^587^', row);
    }
    console.table([...(mrg.walk_line_rows({dsk}))]);
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      // test @[ "mrg.refresh_datasource" ]
      // test @[ "loc markers 1" ]
      return this["loc markers 2"]();
    })();
  }

}).call(this);

//# sourceMappingURL=mirage.tests.js.map