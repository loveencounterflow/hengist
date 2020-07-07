(function() {
  'use strict';
  var CND, alert, badge, debug, echo, help, info, rpr, test, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HENGIST/DEV/INTERSHOP/RPC';

  debug = CND.get_logger('debug', badge);

  alert = CND.get_logger('alert', badge);

  whisper = CND.get_logger('whisper', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  info = CND.get_logger('info', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('guy-test');

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "_XEMITTER: _" ] = ( T, done ) ->
  //   DATOM                     = require '../../../apps/datom'
  //   { new_datom
  //     select }                = DATOM.export()
  //   #.........................................................................................................
  //   probes_and_matchers = [
  //     [['^foo', { time: 1500000, value: "msg#1", }],{"time":1500000,"value":"msg#1","$key":"^foo"},null]
  //     ]
  //   #.........................................................................................................
  //   for [ probe, matcher, error, ] in probes_and_matchers
  //     await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
  //       [ key, value, ] = probe
  //       resolve new_datom key, value
  //   done()
  //   return null

  //-----------------------------------------------------------------------------------------------------------
  this._serve = async function() {
    var DATOM, DB, Rpc, rpc;
    Rpc = require('../../../apps/intershop-rpc');
    DB = require('../../../apps/intershop/intershop_modules/db');
    DATOM = require('../../../apps/datom');
    rpc = new Rpc(23001);
    return (await rpc.start());
  };

  //-----------------------------------------------------------------------------------------------------------
  this["INTERSHOP-RPC basics"] = async function(T, done) {
    var DATOM, DB, Rpc, rpc, settings;
    Rpc = require('../../../apps/intershop-rpc');
    DB = require('../../../apps/intershop/intershop_modules/db');
    DATOM = require('../../../apps/datom');
    //.........................................................................................................
    settings = {
      logging: function(d) {
        var ref;
        echo(CND.grey('^hengist@11^ contract', d));
        return echo(CND.grey(rpc.settings.address + ' RPC:'), CND.steel((ref = d.$value) != null ? ref : d));
      }
    };
    //.........................................................................................................
    rpc = (await Rpc.create(settings));
    rpc.contract('^add-42', function(d) {
      var ref;
      help('^hengist@10^ contract', d);
      return ((ref = (d != null ? d : {}).x) != null ? ref : 0) + 42;
    });
    rpc.listen_to_all(function(key, d) {
      return urge("^hengist@12^ listen_to_all     ", d);
    });
    rpc.listen_to_unheard(function(key, d) {
      return warn("^hengist@13^ listen_to_unheard ", d);
    });
    await rpc.emit('^foobar', 108);
    help('^hengist@14^', (await rpc.delegate('^add-42', {
      x: 123
    })));
    // help '^hengist@15^', await rpc.delegate { '^add-42', x: 123, }
    // help '^hengist@16^', await rpc.delegate { '^add-42', $value: { x: 123, }, }
    // debug '^hengist@17^', await rpc.delegate '^add-42', 123
    T.eq((await rpc.delegate(DATOM.new_datom('^add-42', 123))), 42);
    T.eq((await rpc.delegate(DATOM.new_datom('^add-42', {
      x: 123
    }))), 165);
    T.eq((await DB.query(["select IPC.server_is_online()"])), [
      {
        server_is_online: true
      }
    ]);
    // T.eq ( await DB.query         [ "select IPC.send( $1, $2 );", '^add-42', '{"x":1000}' ] ), [ { send: '' } ] ### TAINT should be `null` ###
    T.eq((await DB.query(["select IPC.rpc( $1, $2 );", '^add-42', '{"x":1000}'])), [
      {
        rpc: 1042
      }
    ]);
    T.eq((await DB.query_single(["select IPC.server_is_online()"])), true);
    // T.eq ( await DB.query_single  [ "select IPC.send( $1, $2 );", '^add-42', '{"x":1000}' ] ), '' ### TAINT should be `null` ###
    T.eq((await DB.query_single(["select IPC.rpc( $1, $2 );", '^add-42', '{"x":1000}'])), 1042);
    info(rpc.counts);
    await DB.query([`select IPC.send( '^log', '"send message #1"' );`]);
    // await DB.query [ """select IPC.rpc( '^log', '"RPC message #2"' );""", ]
    await DB.query([`select log( 'helo' )`]);
    info(rpc.counts);
    // debug '^hengist@18^', await DB.query [ "select * from IPC.send( $1, $2 );", '^add-42', '{"x":1000}' ]
    // debug '^hengist@19^', await DB.query [ "select * from CATALOG.catalog;", $key, ]
    // for row in await DB.query [ "select * from CATALOG.catalog order by schema, name;", ]
    //   whisper '^hengist@20^', "#{row.schema}/#{row.name}"
    await rpc.stop();
    return done();
  };

  // process.exit 0

  //-----------------------------------------------------------------------------------------------------------
  this["INTERSHOP-RPC logging"] = async function(T, done) {
    var DB, Rpc, rpc;
    DB = require('../../../apps/intershop/intershop_modules/db');
    Rpc = require('../../../apps/intershop-rpc');
    rpc = (await Rpc.create());
    rpc.contract('^log', function(d) {
      return info(d);
    });
    debug('^3344-1^');
    rpc.listen_to_all(function(key, d) {
      return urge("^hengist@21^ listen_to_all     ", d);
    });
    debug('^3344-2^');
    rpc.listen_to_unheard(function(key, d) {
      return warn("^hengist@22^ listen_to_unheard ", d);
    });
    debug('^3344-3^');
    debug('^547221^', (await DB.query(["select IPC.server_is_online()"])));
    T.eq((await DB.query(["select IPC.server_is_online()"])), [
      {
        server_is_online: true
      }
    ]);
    debug('^3344-4^');
    await DB.query(["select log( 'helo' )"]);
    debug('^3344-5^');
    return setTimeout((async function() {
      help('ok');
      await rpc.stop();
      return done();
    }), 2000);
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // test @, { timeout: 5000, }
      return test(this["INTERSHOP-RPC basics"], {
        timeout: 5000
      });
    })();
  }

  // test @[ "INTERSHOP-RPC logging" ], { timeout: 5000, }
// @_serve()

}).call(this);

//# sourceMappingURL=rpc.js.map