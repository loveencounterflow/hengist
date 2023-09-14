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
    return new Promise((resolve, reject) => {
      var Intersock, WebSocket, intersock, ws;
      ({WebSocket} = require('../../../apps/intersock/node_modules/ws'));
      ({Intersock} = require('../../../apps/intersock'));
      intersock = new Intersock({
        port: 9876
      });
      debug('^34242^', intersock.cfg);
      //.........................................................................................................
      ws = new WebSocket(intersock.cfg.url);
      ws.on('error', (error) => {
        throw error;
      });
      ws.on('open', () => {
        help("opened connection");
        return ws.send(JSON.stringify('something'));
      });
      ws.on('message', (data) => {
        return info("received", rpr(data));
      });
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