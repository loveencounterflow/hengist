(function() {
  'use strict';
  var GUY, alert, debug, echo, help, info, inspect, isa, jr, log, plain, praise, rpr, test, types, urge, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('intersock/tests/basics'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('guy-test');

  jr = JSON.stringify;

  types = new (require('intertype-newest')).Intertype();

  ({isa} = types);

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "_XEMITTER: _" ] = ( T, done ) ->
  //   { DATOM }                 = require '../../../apps/datom'
  //   { new_datom
  //     select }                = DATOM
  // { Djehuti }               = require '../../../apps/intertalk'
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
  this.intersock_connect = function(T, done) {
    return new Promise(async(resolve, reject) => {
      var Intersock_client, Intersock_server, WebSocket, cfg, client, server;
      ({WebSocket} = require('../../../apps/intersock/node_modules/ws'));
      ({Intersock_server, Intersock_client} = require('../../../apps/intersock'));
      cfg = {
        port: 9876
      };
      server = new Intersock_server(cfg);
      client = new Intersock_client(cfg);
      debug('^34242^', server.cfg);
      await client.connect();
      server.send('info', "greetings from server");
      client.send('info', "greetings from client");
      return typeof done === "function" ? done() : void 0;
    });
  };

  //###########################################################################################################
  if (require.main === module) {
    (async() => {
      // test @
      return (await this.intersock_connect());
    })();
  }

  // test @time_exports
// @time_stamp()
// @time_monostamp()
// test @time_datatypes

}).call(this);

//# sourceMappingURL=test-basics.js.map