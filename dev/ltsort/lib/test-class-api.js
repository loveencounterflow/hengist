(function() {
  'use strict';
  var DATOM, GUY, H, PATH, SQL, alert, debug, echo, equals, guy, help, info, inspect, isa, lets, log, new_datom, plain, praise, rpr, show, stamp, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('INTERTEXT-LEXER/TESTS/TOPOSORT'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  // FS                        = require 'fs'
  types = new (require('../../../apps/intertype')).Intertype();

  ({isa, equals, type_of, validate} = types);

  SQL = String.raw;

  guy = require('../../../apps/guy');

  H = require('../../../lib/helpers');

  ({DATOM} = require('../../../apps/datom'));

  ({new_datom, lets, stamp} = DATOM);

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  show = function(topograph) {
    var LTSORT, dependencies, error, name, ordering, precedents, ref, table, x, y;
    LTSORT = require('../../../apps/ltsort');
    try {
      dependencies = LTSORT.group(topograph);
    } catch (error1) {
      error = error1;
      if ((error.message.match(/detected cycle involving node/)) == null) {
        throw error;
      }
      warn(GUY.trm.reverse(error.message));
      warn('^08-1^', GUY.trm.reverse(error.message));
    }
    // throw new DBay_sqlm_circular_references_error '^dbay/dbm@4^', name, ref_name
    info('^08-2^', dependencies);
    try {
      ordering = LTSORT.linearize(topograph);
    } catch (error1) {
      error = error1;
      if ((error.message.match(/detected cycle involving node/)) == null) {
        throw error;
      }
      warn('^08-3^', GUY.trm.reverse(error.message));
    }
    // throw new DBay_sqlm_circular_references_error '^dbay/dbm@4^', name, ref_name
    table = [];
    ref = topograph.precedents.entries();
    for (y of ref) {
      [name, precedents] = y;
      precedents = precedents.join(', ');
      table.push({name, precedents});
    }
    H.tabulate("topograph", table);
    info('^08-4^', ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = ordering.length; i < len; i++) {
        x = ordering[i];
        results.push(GUY.trm.yellow(x));
      }
      return results;
    })()).join(GUY.trm.grey(' => ')));
    return null;
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.instantiation = function(T, done) {
    var Ltsort, g;
    ({Ltsort} = require('../../../apps/ltsort'));
    g = new Ltsort();
    debug('^40-1^', g);
    if (T != null) {
      T.eq(rpr(g), "Ltsort { cfg: { loners: true } }");
    }
    if (T != null) {
      T.eq(g.cfg.loners, true);
    }
    if (T != null) {
      T.eq(g.linearize(), []);
    }
    if (T != null) {
      T.eq(g.linearize({
        groups: true
      }), [[]]);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.add_nodes = function(T, done) {
    var Ltsort, g;
    ({Ltsort} = require('../../../apps/ltsort'));
    g = new Ltsort();
    if (T != null) {
      T.eq(type_of(g.add), 'function');
    }
    //.........................................................................................................
    g.add({
      name: 'first'
    });
    g.add({
      name: 'second'
    });
    g.add({
      name: 'third'
    });
    (function() {      //.........................................................................................................
      var result;
      result = g.linearize();
      return T != null ? T.eq(result, ['first', 'second', 'third']) : void 0;
    })();
    (function() {      //.........................................................................................................
      var result;
      result = g.linearize({
        groups: true
      });
      return T != null ? T.eq(result, [['first', 'second', 'third']]) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.use_relatives = function(T, done) {
    var Ltsort, g;
    ({Ltsort} = require('../../../apps/ltsort'));
    g = new Ltsort();
    //.........................................................................................................
    g.add({
      name: 'getup'
    });
    g.add({
      name: 'brushteeth'
    });
    g.add({
      name: 'shop'
    });
    g.add({
      name: 'cook',
      precedes: 'eat'
    });
    g.add({
      name: 'serve',
      needs: 'cook',
      precedes: 'eat'
    });
    g.add({
      name: 'dishes',
      needs: 'eat',
      precedes: 'sleep'
    });
    g.add({
      name: 'loner1'
    });
    g.add({
      name: 'loner2'
    });
    g.add({
      name: 'loner3'
    });
    g.add({
      name: 'sleep'
    });
    g.add({
      name: 'eat',
      needs: ['cook', 'shop']
    });
    (function() {      //.........................................................................................................
      var result;
      result = g.linearize();
      return T != null ? T.eq(result, ['getup', 'brushteeth', 'shop', 'cook', 'serve', 'eat', 'dishes', 'sleep', 'loner1', 'loner2', 'loner3']) : void 0;
    })();
    (function() {      //.........................................................................................................
      var result;
      result = g.linearize({
        groups: true
      });
      return T != null ? T.eq(result, [['getup', 'brushteeth', 'loner1', 'loner2', 'loner3'], ['shop', 'cook'], ['serve'], ['eat'], ['dishes'], ['sleep']]) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.use_global_relatives = function(T, done) {
    var Ltsort, g;
    ({Ltsort} = require('../../../apps/ltsort'));
    g = new Ltsort();
    //.........................................................................................................
    g.add({
      name: 'cook',
      precedes: 'eat'
    });
    g.add({
      name: 'serve',
      needs: 'cook',
      precedes: 'eat'
    });
    g.add({
      name: 'eat',
      needs: ['cook', 'shop']
    });
    g.add({
      name: 'shop',
      precedes: '*'
    });
    g.add({
      name: 'brushteeth',
      precedes: '*'
    });
    g.add({
      name: 'getup',
      precedes: '*'
    });
    g.add({
      name: 'dishes',
      needs: '*'
    });
    g.add({
      name: 'sleep',
      needs: '*'
    });
    g.add({
      name: 'loner1'
    });
    g.add({
      name: 'loner2'
    });
    g.add({
      name: 'loner3'
    });
    (function() {      //.........................................................................................................
      var result;
      result = g.linearize();
      return T != null ? T.eq(result, ['getup', 'brushteeth', 'shop', 'cook', 'serve', 'eat', 'dishes', 'sleep', 'loner1', 'loner2', 'loner3']) : void 0;
    })();
    (function() {      //.........................................................................................................
      var result;
      result = g.linearize({
        groups: true
      });
      return T != null ? T.eq(result, [['loner1', 'loner2', 'loner3'], ['getup'], ['brushteeth'], ['shop'], ['cook'], ['serve'], ['eat'], ['dishes'], ['sleep']]) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.before_and_after_with_antecedents_and_subsequents_1 = function(T, done) {
    var Ltsort, g;
    ({Ltsort} = require('../../../apps/ltsort'));
    //.........................................................................................................
    g = new Ltsort();
    g.add({
      name: 't1',
      precedes: '*'
    });
    g.add({
      name: 't2',
      precedes: '*'
    });
    g.add({
      name: 't3',
      precedes: '*'
    });
    g.add({
      name: 'middle'
    });
    if (T != null) {
      T.eq(g.linearize(), ['t3', 't2', 't1', 'middle']);
    }
    g.add({
      name: 'bully-t3-precedes',
      precedes: 't3'
    });
    g.add({
      name: 'bully-t3-needs',
      needs: 't3'
    });
    debug('^23-1^', g.precedents);
    if (T != null) {
      T.eq(g.linearize(), ['bully-t3-precedes', 't3', 't2', 't1', 'bully-t3-needs', 'middle']);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.before_and_after_with_antecedents_and_subsequents_2 = function(T, done) {
    var Ltsort, g;
    ({Ltsort} = require('../../../apps/ltsort'));
    //.........................................................................................................
    g = new Ltsort();
    g.add({
      name: 't3',
      needs: '*'
    });
    g.add({
      name: 't2',
      needs: '*'
    });
    g.add({
      name: 't1',
      needs: '*'
    });
    g.add({
      name: 'middle'
    });
    if (T != null) {
      T.eq(g.linearize(), ['t3', 't2', 't1', 'middle']);
    }
    g.add({
      name: 'middle',
      needs: 't3',
      precedes: 't2'
    });
    if (T != null) {
      T.eq(g.linearize(), ['t3', 'middle', 't2', 't1']);
    }
    g.add({
      name: 'bully-t1-needs',
      needs: 't1'
    });
    g.add({
      name: 'bully-t1-precedes',
      precedes: 't1'
    });
    if (T != null) {
      T.eq(g.linearize(), ['t3', 'middle', 't2', 'bully-t1-precedes', 't1', 'bully-t1-needs']);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.before_and_after_with_antecedents_and_subsequents_3 = function(T, done) {
    var Ltsort, g;
    ({Ltsort} = require('../../../apps/ltsort'));
    //.........................................................................................................
    g = new Ltsort();
    g.add({
      name: 'top3',
      precedes: '*'
    });
    g.add({
      name: 'top2',
      precedes: '*'
    });
    g.add({
      name: 'top1',
      precedes: '*'
    });
    g.add({
      name: 'bottom3',
      needs: '*'
    });
    g.add({
      name: 'bottom2',
      needs: '*'
    });
    g.add({
      name: 'bottom1',
      needs: '*'
    });
    g.add({
      name: 'middle',
      needs: 'top3',
      precedes: 'bottom3'
    });
    if (T != null) {
      T.eq(g.linearize(), ['top1', 'top2', 'top3', 'middle', 'bottom3', 'bottom2', 'bottom1']);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // @_toposort()
      return test(this);
    })();
  }

  // @instantiation()
// test @instantiation
// test @add_nodes
// @use_global_relatives()
// test @use_global_relatives
// test @before_and_after_with_antecedents_and_subsequents_3

}).call(this);

//# sourceMappingURL=test-class-api.js.map