(function() {
  'use strict';
  var GUY, alert, debug, demo_1, demo_2, echo, help, info, inspect, log, plain, praise, rpr, types, urge, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('MOONRIVER/NG'));

  ({rpr, inspect, echo, log} = GUY.trm);

  types = new (require('../../../apps/intertype')).Intertype();

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  demo_1 = function() {
    var Pipeline, on_after_process, on_after_step, on_before_process, on_before_step, p, plus_2, times_2, times_3;
    echo('—————————————————————————————————————————————');
    ({Pipeline} = require('../../../apps/moonriver'));
    on_before_process = function() {
      return help('^97-1^', this);
    };
    on_after_process = function() {
      return warn('^97-2^', this);
    };
    on_before_step = function(sidx) {
      return urge('^97-3^', sidx, this);
    };
    on_after_step = function(sidx) {
      return urge('^97-4^', sidx, this);
    };
    on_before_step = null;
    // on_after_step     = null
    on_after_process = null;
    p = new Pipeline({on_before_process, on_before_step, on_after_step, on_after_process});
    p.push(times_2 = function(d, send) {
      if (types.isa.float(d)) {
        // send '('
        return send(d * 2);
      } else {
        // send ')'
        return send(d);
      }
    });
    p.push(plus_2 = function(d, send) {
      if (types.isa.float(d)) {
        // send '['
        return send(d + 2);
      } else {
        // send ']'
        return send(d);
      }
    });
    p.push(times_3 = function(d, send) {
      if (types.isa.float(d)) {
        // send '{'
        return send(d * 3);
      } else {
        // send '}'
        return send(d);
      }
    });
    p.send(1);
    p.send(2);
    p.send(3);
    // urge '^97-4^', d for d from p.walk()
    info('^97-4^', p.run());
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_2 = function() {
    var Pipeline, on_after_process, on_after_step, on_before_process, on_before_step, p, show_2;
    echo('—————————————————————————————————————————————');
    ({Pipeline} = require('../../../apps/moonriver'));
    on_before_process = null;
    on_before_step = null;
    on_after_step = null;
    on_after_process = null;
    // on_before_process = -> help '^98-1^', @
    // on_after_process  = -> warn '^98-2^', @
    // on_before_step    =  ( sidx ) -> urge '^98-3^', sidx, @
    // on_after_step     =  ( sidx ) -> urge '^98-4^', sidx, @
    p = new Pipeline({on_before_process, on_before_step, on_after_step, on_after_process});
    // p = new Pipeline()
    // p.push 'AB'
    // p.push 'CD'
    // p.push [ 1, 2, 3, ]
    // p.push [ 4, 5, 6, ]
    p.push({
      one: 'cat',
      two: 'dog',
      three: 'pony'
    });
    p.push(new Set('+-*'));
    p.push(new Map([[11, 12], [13, 14]]));
    p.push('ABC');
    p.push('DEF');
    p.push('GHIJ');
    // p.push show_1 = ( d, send ) -> whisper rpr d; send d
    p.push(show_2 = function(d) {
      return whisper(rpr(d));
    });
    p.send(0);
    p.send(1);
    p.send(2);
    info('^98-5^', p);
    info('^98-6^', p.run());
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      demo_1();
      return demo_2();
    })();
  }

}).call(this);

//# sourceMappingURL=demo-ng.js.map