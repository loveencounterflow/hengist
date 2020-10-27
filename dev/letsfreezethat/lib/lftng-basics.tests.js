(function() {
  'use strict';
  var CND, FS, PATH, badge, debug, echo, help, info, isa, resolve_project_path, rpr, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HENGIST/DEV/LFTNG-BASICS';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('guy-test');

  PATH = require('path');

  FS = require('fs');

  //...........................................................................................................
  types = new (require('intertype')).Intertype();

  ({isa, validate, type_of} = types.export());

  //-----------------------------------------------------------------------------------------------------------
  resolve_project_path = function(path) {
    return PATH.resolve(PATH.join(__dirname, '../../..', path));
  };

  //-----------------------------------------------------------------------------------------------------------
  this["LFTNG API"] = function(T, done) {
    var LFT, lft_cfg;
    lft_cfg = {
      copy: true,
      freeze: true
    };
    LFT = (require('./letsfreezethat-NG')).new(lft_cfg);
    //.........................................................................................................
    T.eq('function', type_of(LFT.new_object));
    T.eq(0, LFT.new_object.length);
    /* NOTE actually splat argument */    T.eq('function', type_of(LFT.assign));
    T.eq(1, LFT.assign.length);
    /* NOTE actually splat argument */    T.eq('function', type_of(LFT.freeze));
    T.eq(1, LFT.freeze.length);
    T.eq('function', type_of(LFT.thaw));
    T.eq(1, LFT.thaw.length);
    T.eq('function', type_of(LFT.lets));
    T.eq(2, LFT.lets.length);
    T.eq('function', type_of(LFT.get));
    T.eq(2, LFT.get.length);
    T.eq('function', type_of(LFT.set));
    T.eq(3, LFT.set.length);
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["LFTNG freeze, thaw"] = function(T, done) {
    var LFT_CNFY, LFT_DFLT;
    LFT_DFLT = require('./letsfreezethat-NG');
    //.........................................................................................................
    urge('^33738-1^');
    LFT_CNFY = null;
    T.throws(/not a valid.*cfg/, function() {
      return LFT_CNFY = LFT_DFLT.new({
        copy: false,
        freeze: true
      });
    });
    T.eq(LFT_CNFY, null);
    (() => {      //.........................................................................................................
      var LFT, d1, d2, d3;
      urge('^33738-2^');
      LFT = LFT_DFLT;
      d1 = {};
      d2 = LFT.lets(d1);
      T.ok(d1 !== d2);
      T.ok(isa.frozen(d2));
      d3 = LFT.set(d2, 'key', 'value');
      T.eq(LFT.get(d3, 'key'), 'value');
      T.eq(d3.key, 'value');
      T.ok(d2 !== d3);
      T.eq(LFT.get(d2, 'key'), void 0);
      return T.eq(d2.key, void 0);
    })();
    (() => {      //.........................................................................................................
      var LFT, d1, d2, d3;
      urge('^33738-3^');
      LFT = LFT_DFLT.new({
        copy: true,
        freeze: true
      });
      d1 = {};
      d2 = LFT.lets(d1);
      T.ok(d1 !== d2);
      T.ok(isa.frozen(d2));
      d3 = LFT.set(d2, 'key', 'value');
      T.ok(isa.frozen(d3));
      T.eq(LFT.get(d3, 'key'), 'value');
      T.eq(d3.key, 'value');
      T.ok(d2 !== d3);
      T.eq(LFT.get(d2, 'key'), void 0);
      return T.eq(d2.key, void 0);
    })();
    (() => {      //.........................................................................................................
      var LFT, d1, d2, d3;
      LFT = LFT_DFLT.new({
        copy: true,
        freeze: false
      });
      urge('^33738-4^');
      d1 = {};
      d2 = LFT.lets(d1);
      T.ok(d1 !== d2);
      T.ok(!isa.frozen(d2));
      d3 = LFT.set(d2, 'key', 'value');
      T.ok(!isa.frozen(d3));
      T.eq(LFT.get(d3, 'key'), 'value');
      T.eq(d3.key, 'value');
      T.ok(d2 !== d3);
      T.eq(LFT.get(d2, 'key'), void 0);
      return T.eq(d2.key, void 0);
    })();
    (() => {      //.........................................................................................................
      var LFT, d1, d2, d3;
      LFT = LFT_DFLT.new({
        copy: false,
        freeze: false
      });
      urge('^33738-5^');
      d1 = {};
      d2 = LFT.lets(d1);
      T.ok(d1 === d2);
      T.ok(!isa.frozen(d2));
      d3 = LFT.set(d2, 'key', 'value');
      T.ok(!isa.frozen(d3));
      T.eq(LFT.get(d3, 'key'), 'value');
      T.eq(d3.key, 'value');
      T.ok(d2 === d3);
      T.eq(LFT.get(d2, 'key'), 'value');
      return T.eq(d2.key, 'value');
    })();
    //.........................................................................................................
    done();
    return null;
  };

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "LFTNG API" ] = ( T, done ) ->
  //   lft_cfg       = { copy: true, freeze: true, }
  //   LFT           = ( require './letsfreezethat-NG' ).new lft_cfg
  //   #.........................................................................................................
  //   probes_and_matchers = []
  //     ]
  //   #.........................................................................................................
  //   for [ probe, matcher, error, ] in probes_and_matchers
  //     await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
  //       [ type, value, ] = probe
  //       resolve LFTNG.types.isa type, value
  //   done()
  //   return null

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return test(this);
    })();
  }

  // test @[ "test VNR._first_nonzero_is_negative()" ]

}).call(this);

//# sourceMappingURL=lftng-basics.tests.js.map