(function() {
  'use strict';
  var CND, alert, badge, cast, debug, echo, help, info, isa, rpr, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HENGIST/DEV/INTERPLOT/HYPHENATION-OVER-RPC';

  debug = CND.get_logger('debug', badge);

  alert = CND.get_logger('alert', badge);

  whisper = CND.get_logger('whisper', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  info = CND.get_logger('info', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  types = new (require('intertype')).Intertype();

  ({isa, validate, cast, type_of} = types.export());

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
    var DATOM, DB, Rpc, create_server_one_step, create_server_two_steps, rpc;
    Rpc = require('../../../apps/intershop-rpc');
    DB = require('../../../apps/intershop/intershop_modules/db');
    DATOM = require('../../../apps/datom');
    //.........................................................................................................
    create_server_two_steps = async function() {
      var rpc;
      rpc = new Rpc();
      await rpc.start();
      return rpc;
    };
    //.........................................................................................................
    create_server_one_step = async function() {
      return (await Rpc.create());
    };
    //.........................................................................................................
    // rpc = await create_server_two_steps()
    rpc = (await create_server_one_step());
    rpc.contract('^add-42', function(d) {
      var ref;
      help('^hengist@101^ contract', d);
      return ((ref = (d != null ? d : {}).x) != null ? ref : 0) + 42;
    });
    rpc.listen_to_all(function(key, d) {
      return urge("^hengist@102^ listen_to_all     ", d);
    });
    rpc.listen_to_unheard(function(key, d) {
      return warn("^hengist@103^ listen_to_unheard ", d);
    });
    await rpc.emit('^foobar', 108);
    help('^hengist@104^', (await rpc.delegate('^add-42', {
      x: 123
    })));
    // help '^hengist@105^', await rpc.delegate { '^add-42', x: 123, }
    // help '^hengist@106^', await rpc.delegate { '^add-42', $value: { x: 123, }, }
    // debug '^hengist@107^', await rpc.delegate '^add-42', 123
    T.eq((await rpc.delegate(DATOM.new_datom('^add-42', 123))), 42);
    T.eq((await rpc.delegate(DATOM.new_datom('^add-42', {
      x: 123
    }))), 165);
    T.eq((await DB.query(["select IPC.server_is_online()"])), [
      {
        server_is_online: true
      }
    ]);
    T.eq((await DB.query(["select IPC.send( $1, $2 );", '^add-42', '{"x":1000}'])), [
      {
        send: ''
      }
    ]);
    /* TAINT should be `null` */    T.eq((await DB.query(["select IPC.rpc( $1, $2 );", '^add-42', '{"x":1000}'])), [
      {
        rpc: 1042
      }
    ]);
    T.eq((await DB.query_single(["select IPC.server_is_online()"])), true);
    T.eq((await DB.query_single(["select IPC.send( $1, $2 );", '^add-42', '{"x":1000}'])), '');
    /* TAINT should be `null` */    T.eq((await DB.query_single(["select IPC.rpc( $1, $2 );", '^add-42', '{"x":1000}'])), 1042);
    info(rpc.counts);
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["INTERPLOT hyphenation"] = async function(T, done) {
    var CP, DATOM, DB, Rpc, after, command, cp, rpc, settings;
    Rpc = require('../../../apps/intershop-rpc');
    DB = require('../../../apps/intershop/intershop_modules/db');
    DATOM = require('../../../apps/datom');
    CP = require('child_process');
    after = function(time_s, f) {
      return setTimeout(f, time_s * 1000);
    };
    //.........................................................................................................
    rpc = (await Rpc.create({
      show_counts: true,
      count_interval: 1
    }));
    //.........................................................................................................
    rpc.contract('^hyphenate', function(d) {
      var text;
      // debug '^447^', rpr text
      validate.text(text = d.$value);
      return (text.split(/\s+/)).join('-');
    });
    //.........................................................................................................
    command = `psql -U interplot -d interplot -f "db/100-harfbuzz.sql" `;
    settings = {
      cwd: '/home/flow/jzr/interplot/',
      shell: true,
      stdio: ['inherit', 'inherit', 'inherit']
    };
    cp = CP.spawn(command, null, settings);
    // cp.stdout.on 'data', ( data ) ->
    //   data = data.toString 'utf-8'
    //   help rpr data
    // cp.stdout.on 'error', ( error ) -> warn "stdout.on 'error'  ", rpr error
    // cp.stderr.on 'data',  ( data )  -> warn "stderr.on 'data'   ", rpr data.toString 'utf-8'
    // cp.stderr.on 'error', ( error ) -> warn "stderr.on 'error'  ", rpr error
    return after(3, function() {
      help('ok');
      return done();
    });
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // test @
      // @_serve()
      return test(this["INTERPLOT hyphenation"], {
        timeout: 5000
      });
    })();
  }

}).call(this);

//# sourceMappingURL=hyphenation-over-rpc.js.map