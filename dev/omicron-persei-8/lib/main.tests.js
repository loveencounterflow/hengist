(function() {
  'use strict';
  var CND, alert, badge, cast, debug, defer, echo, help, info, isa, jr, log, rpr, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'OMICRON-PERSEI-8/TESTS';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  ({jr} = CND);

  //...........................................................................................................
  test = require('guy-test');

  types = new (require('intertype')).Intertype();

  ({isa, validate, cast, type_of} = types);

  defer = setImmediate;

  //===========================================================================================================
  // TESTS
  //-----------------------------------------------------------------------------------------------------------
  this["OMICRON-PERSEI-8 API 1"] = function(T, done) {
    var CAT, LRRR, LRRR_export, i, len, name, names;
    LRRR = require('../../../apps/omicron-persei-8');
    CAT = require('multimix/lib/cataloguing');
    names = ['$', 'remit', 'types', 'export'];
    LRRR_export = LRRR.export();
//.........................................................................................................
    for (i = 0, len = names.length; i < len; i++) {
      name = names[i];
      T.ok(LRRR[name] != null);
      T.ok(LRRR_export[name] != null);
    }
    // urge CAT.all_keys_of LRRR
    // urge ( k for k of LRRR )
    // urge ( k for k of LRRR.export() )
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["OMICRON-PERSEI-8 API 2"] = async function(T, done) {
    var LRRR, error, i, len, matcher, probe, probes_and_matchers;
    LRRR = require('../../../apps/omicron-persei-8');
    probes_and_matchers = [[['function', 'remit'], true], [['function', '$'], true], [['object', 'types'], true]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var name, type;
          [type, name] = probe;
          return resolve(isa[type](LRRR[name]));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["OMICRON-PERSEI-8.remit 1"] = function(T, done) {
    var $, $remitter, CAT, FS, Readable, Transform, Writable, read, source, stream, transform, write;
    // debug '^776^', ( k for k of require 'readable-stream' ); return done()
    ({$} = require('../../../apps/omicron-persei-8'));
    CAT = require('multimix/lib/cataloguing');
    FS = require('fs');
    ({Readable, Transform, Writable} = require('readable-stream'));
    //.........................................................................................................
    read = function(size) {
      var d, i;
      urge('^read@1^'); // , CAT.all_keys_of @
      for (d = i = 1; i <= 3; d = ++i) {
        this.push(d);
      }
      this.push(null);
      return this.destroy();
    };
    // @emit 'end'
    // @emit 'close'
    // debug ( k for k of @ )
    //.........................................................................................................
    transform = function(d, _, done) {
      urge('^transform@1^', rpr(d));
      this.push(d.toString());
      return done();
    };
    //.........................................................................................................
    $remitter = () => {
      return $((d, send) => {
        urge('^remit@1^', (rpr(d)).slice(0, 51) + '...');
        return send(d); //.toString 'utf-8' ### TAINT not safe as could be chunked ###
      });
    };
    //.........................................................................................................
    write = function(d, _, done) {
      urge('^write@1^', (rpr(d)).slice(0, 51) + '...');
      return done();
    };
    //.........................................................................................................
    // source  = FS.createReadStream __filename
    source = new Readable({
      read,
      objectMode: true
    });
    stream = source;
    // # stream  = stream.pipe new Transform { transform, }
    stream = stream.pipe($remitter());
    stream = stream.pipe(new Writable({
      write,
      objectMode: true
    }));
    //.........................................................................................................
    source.on('end', function() {
      return info('^source:end^');
    });
    source.on('close', function() {
      info('^source:close^');
      return defer(function() {
        return done();
      });
    });
    stream.on('end', function() {
      return info('^stream:end^');
    });
    stream.on('close', function() {
      return info('^stream:close^');
    });
    // defer -> done()
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => { // await do =>
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=main.tests.js.map